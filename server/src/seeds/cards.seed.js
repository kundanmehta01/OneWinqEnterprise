import { Card } from '../modules/cards/card.model.js';
import { TeamMember } from '../modules/team-members/teamMember.model.js';
import { EmployeeProfile } from '../modules/employee-profile/employeeProfile.model.js';
import { logger } from '../config/logger.config.js';

export const seedCards = async () => {
  try {
    logger.info('  [Cards] Checking and seeding smart NFC cards inventory...');

    const existingCount = await Card.countDocuments();
    if (existingCount > 0) {
      logger.info(`  [Cards] ${existingCount} cards already exist in inventory. Skipping seed.`);
      return;
    }

    // Find sample members to link initial executive cards
    const rajatMember = await TeamMember.findOne({ employeeId: { $in: ['EMP-001', 'OWQ-001'] } });
    const priyaMember = await TeamMember.findOne({ employeeId: { $in: ['EMP-002', 'OWQ-002'] } });

    const sampleCards = [
      {
        cardUid: 'OWQ-NFC-89421',
        serialNumber: 'SN-2026-00101',
        cardType: 'metal_black',
        batchNumber: 'BATCH-2026-01',
        status: rajatMember ? 'linked' : 'unassigned',
        memberId: rajatMember ? rajatMember._id : null,
        profileId: rajatMember ? rajatMember.profileId : null,
        linkedAt: rajatMember ? new Date() : null,
        tapCount: 142,
        notes: 'Executive Matte Black Metal Smart NFC Card issued to Founder & CEO'
      },
      {
        cardUid: 'OWQ-NFC-89422',
        serialNumber: 'SN-2026-00102',
        cardType: 'metal_gold',
        batchNumber: 'BATCH-2026-01',
        status: priyaMember ? 'linked' : 'unassigned',
        memberId: priyaMember ? priyaMember._id : null,
        profileId: priyaMember ? priyaMember.profileId : null,
        linkedAt: priyaMember ? new Date() : null,
        tapCount: 89,
        notes: 'Executive Gold Metal Smart NFC Card issued to Head of Engineering'
      },
      {
        cardUid: 'OWQ-NFC-89423',
        serialNumber: 'SN-2026-00103',
        cardType: 'pvc_matte',
        batchNumber: 'BATCH-2026-01',
        status: 'unassigned',
        memberId: null,
        profileId: null,
        notes: 'Inventory stock - Ready for team member linking'
      },
      {
        cardUid: 'OWQ-NFC-89424',
        serialNumber: 'SN-2026-00104',
        cardType: 'pvc_glossy',
        batchNumber: 'BATCH-2026-01',
        status: 'unassigned',
        memberId: null,
        profileId: null,
        notes: 'Inventory stock - Ready for team member linking'
      },
      {
        cardUid: 'OWQ-NFC-89425',
        serialNumber: 'SN-2026-00105',
        cardType: 'bamboo_wood',
        batchNumber: 'BATCH-2026-01',
        status: 'unassigned',
        memberId: null,
        profileId: null,
        notes: 'Eco Bamboo Wooden NFC Card - Inventory stock'
      },
      {
        cardUid: 'OWQ-NFC-89426',
        serialNumber: 'SN-2026-00106',
        cardType: 'metal_silver',
        batchNumber: 'BATCH-2026-01',
        status: 'unassigned',
        memberId: null,
        profileId: null,
        notes: 'Silver Stainless Steel NFC Card - Inventory stock'
      }
    ];

    await Card.insertMany(sampleCards);
    logger.info(`  [Cards] Successfully seeded ${sampleCards.length} smart NFC cards into inventory.`);
  } catch (error) {
    logger.error(`  [Cards] Failed to seed cards: ${error.message}`);
  }
};
