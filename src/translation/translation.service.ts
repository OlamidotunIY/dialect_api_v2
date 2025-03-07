import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma.services';

@Injectable()
export class TranslationService {
  private readonly azureBaseUrl = process.env.AZURE_BASE_URL;
  private readonly azureKey = process.env.AZURE_KEY;
  private readonly azureLocation = process.env.AZURE_LOCATION;
  private supportedLanguages: string[] = []; // Cached list of languages
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  private async fetchSupportedLanguages(): Promise<string[]> {
    try {
      const config = {
        baseURL: this.azureBaseUrl,
        url: '/languages',
        method: 'get',
        params: {
          'api-version': '3.0',
        },
        responseType: 'json' as const,
      };

      const response = await lastValueFrom(this.httpService.request(config));
      const languages = response.data.translation || {};

      // Extract language codes (e.g., 'en', 'es', etc.)
      return Object.keys(languages);
    } catch (error) {
      console.error('Error fetching supported languages:', error);
      throw new HttpException(
        'Failed to fetch supported languages',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Initialize or update the supported languages list
  private async initializeSupportedLanguages() {
    this.supportedLanguages = await this.fetchSupportedLanguages();
  }

  async translateContent(content: string, messageId: string) {
    try {
      if (!this.supportedLanguages.length) {
        await this.initializeSupportedLanguages();
      }

      const config = {
        baseURL: this.azureBaseUrl,
        url: '/translate',
        method: 'post',
        headers: {
          'Ocp-Apim-Subscription-Key': this.azureKey,
          'Ocp-Apim-Subscription-Region': this.azureLocation,
          'Content-type': 'application/json',
        },
        params: {
          'api-version': '3.0',
          to: this.supportedLanguages.join(','),
        },
        data: [
          {
            Text: content,
          },
        ],
      };

      // Make the HTTP request and await the response
      const response = await lastValueFrom(this.httpService.request(config));

      // Extract data from the response
      const detectedLanguage = response.data[0]?.detectedLanguage?.language;
      const translations: Record<string, string> = {};

      for (const translation of response.data[0]?.translations || []) {
        await this.prisma.textTranslation.create({
          data: {
            message: {
              connect: {
                id: messageId,
              },
            },
            text: translation.text,
            language: translation.to,
          },
        });
      }

      await this.prisma.message.update({
        where: {
          id: messageId,
        },
        data: {
          originalLanguage: detectedLanguage,
          isTranslating: false,
          isTranslated: true,
        },
      });

      return translations;
    } catch (error) {
      console.error('Translation error:', error);
      throw new HttpException('Translation failed', HttpStatus.BAD_REQUEST);
    }
  }

  private async speechToText() {
    // Implement speech-to-text translation
  }

  private async textToSpeech() {
    // Implement text-to-speech translation
  }

  async translateVoiceMessage() {
    // Implement voice message translation

    if (!this.supportedLanguages.length) {
      await this.initializeSupportedLanguages();
    }
  }
}
