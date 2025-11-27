import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Adding missing permissions...');

  // Get existing roles
  const roles = await prisma.role.findMany();

  const adminRole = roles.find(r => r.name === 'Admin');
  const managerRole = roles.find(r => r.name === 'Project Manager');
  const developerRole = roles.find(r => r.name === 'Developer');
  const designerRole = roles.find(r => r.name === 'Designer');
  const qaRole = roles.find(r => r.name === 'QA Engineer');

  if (!adminRole || !managerRole || !developerRole || !designerRole || !qaRole) {
    console.error('❌ Could not find all required roles');
    return;
  }

  // Check what permissions already exist
  const existingPermissions = await prisma.permission.findMany();
  console.log(`Found ${existingPermissions.length} existing permissions`);

  const newPermissions: Array<{
    name: string;
    value: boolean;
    resourceType: 'WORKSPACE' | 'CHANNEL' | 'STREAM' | 'PROJECT' | 'TASK' | 'TEAM';
    roleId: string;
  }> = [
    // Stream permissions
    { name: 'create', value: true, resourceType: 'STREAM', roleId: adminRole.id },
    { name: 'read', value: true, resourceType: 'STREAM', roleId: adminRole.id },
    { name: 'update', value: true, resourceType: 'STREAM', roleId: adminRole.id },
    { name: 'delete', value: true, resourceType: 'STREAM', roleId: adminRole.id },

    { name: 'create', value: true, resourceType: 'STREAM', roleId: managerRole.id },
    { name: 'read', value: true, resourceType: 'STREAM', roleId: managerRole.id },
    { name: 'update', value: true, resourceType: 'STREAM', roleId: managerRole.id },

    { name: 'read', value: true, resourceType: 'STREAM', roleId: developerRole.id },
    { name: 'read', value: true, resourceType: 'STREAM', roleId: designerRole.id },
    { name: 'read', value: true, resourceType: 'STREAM', roleId: qaRole.id },

    // Channel permissions
    { name: 'create', value: true, resourceType: 'CHANNEL', roleId: adminRole.id },
    { name: 'read', value: true, resourceType: 'CHANNEL', roleId: adminRole.id },
    { name: 'update', value: true, resourceType: 'CHANNEL', roleId: adminRole.id },
    { name: 'delete', value: true, resourceType: 'CHANNEL', roleId: adminRole.id },

    { name: 'create', value: true, resourceType: 'CHANNEL', roleId: managerRole.id },
    { name: 'read', value: true, resourceType: 'CHANNEL', roleId: managerRole.id },
    { name: 'update', value: true, resourceType: 'CHANNEL', roleId: managerRole.id },

    { name: 'read', value: true, resourceType: 'CHANNEL', roleId: developerRole.id },
    { name: 'read', value: true, resourceType: 'CHANNEL', roleId: designerRole.id },
    { name: 'read', value: true, resourceType: 'CHANNEL', roleId: qaRole.id },

    // Team permissions
    { name: 'create', value: true, resourceType: 'TEAM', roleId: adminRole.id },
    { name: 'read', value: true, resourceType: 'TEAM', roleId: adminRole.id },
    { name: 'update', value: true, resourceType: 'TEAM', roleId: adminRole.id },
    { name: 'delete', value: true, resourceType: 'TEAM', roleId: adminRole.id },

    { name: 'create', value: true, resourceType: 'TEAM', roleId: managerRole.id },
    { name: 'read', value: true, resourceType: 'TEAM', roleId: managerRole.id },
    { name: 'update', value: true, resourceType: 'TEAM', roleId: managerRole.id },

    { name: 'read', value: true, resourceType: 'TEAM', roleId: developerRole.id },
    { name: 'read', value: true, resourceType: 'TEAM', roleId: designerRole.id },
    { name: 'read', value: true, resourceType: 'TEAM', roleId: qaRole.id },

    // Project permissions (read access for all roles)
    { name: 'read', value: true, resourceType: 'PROJECT', roleId: adminRole.id },
    { name: 'read', value: true, resourceType: 'PROJECT', roleId: managerRole.id },
    { name: 'read', value: true, resourceType: 'PROJECT', roleId: developerRole.id },
    { name: 'read', value: true, resourceType: 'PROJECT', roleId: designerRole.id },
    { name: 'read', value: true, resourceType: 'PROJECT', roleId: qaRole.id },

    // Task permissions (read access for all roles)
    { name: 'read', value: true, resourceType: 'TASK', roleId: adminRole.id },
    { name: 'read', value: true, resourceType: 'TASK', roleId: managerRole.id },
    { name: 'read', value: true, resourceType: 'TASK', roleId: developerRole.id },
    { name: 'read', value: true, resourceType: 'TASK', roleId: designerRole.id },
    { name: 'read', value: true, resourceType: 'TASK', roleId: qaRole.id },
  ];

  // Filter out permissions that already exist
  const permissionsToAdd = newPermissions.filter(newPerm => {
    return !existingPermissions.some(existing =>
      existing.name === newPerm.name &&
      existing.resourceType === newPerm.resourceType &&
      existing.roleId === newPerm.roleId
    );
  });

  if (permissionsToAdd.length === 0) {
    console.log('✅ All permissions already exist!');
    return;
  }

  await prisma.permission.createMany({ data: permissionsToAdd });
  console.log(`✅ Added ${permissionsToAdd.length} new permissions`);

  const totalPermissions = await prisma.permission.count();
  console.log(`📊 Total permissions in database: ${totalPermissions}`);
}

main()
  .catch((e) => {
    console.error('❌ Error adding permissions:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
