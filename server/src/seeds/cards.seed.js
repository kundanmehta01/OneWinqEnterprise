import { Card } from '../modules/cards/card.model.js';
import { TeamMember } from '../modules/team-members/teamMember.model.js';
import { EmployeeProfile } from '../modules/employee-profile/employeeProfile.model.js';
import { logger } from '../config/logger.config.js';

export const seedCards = async () => {
  try {
    logger.info('  [Cards] Seeding smart NFC cards inventory and assigning to software leadership...');

    await Card.deleteMany({});

    // Find key software team members to link initial hardware cards
    const rajatMember = await TeamMember.findOne({ employeeId: 'EMP-001' });
    const priyaMember = await TeamMember.findOne({ employeeId: 'EMP-002' });
    const rahulMember = await TeamMember.findOne({ employeeId: 'EMP-003' });
    const anjaliMember = await TeamMember.findOne({ employeeId: 'EMP-008' });
    const kabirMember = await TeamMember.findOne({ employeeId: 'EMP-014' });

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
        tapCount: 284,
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
        tapCount: 196,
        notes: 'Executive 24K Gold Plated Smart NFC Card issued to Chief Technology Officer'
      },
      {
        cardUid: 'OWQ-NFC-89423',
        serialNumber: 'SN-2026-00103',
        cardType: 'metal_silver',
        batchNumber: 'BATCH-2026-01',
        status: rahulMember ? 'linked' : 'unassigned',
        memberId: rahulMember ? rahulMember._id : null,
        profileId: rahulMember ? rahulMember.profileId : null,
        linkedAt: rahulMember ? new Date() : null,
        tapCount: 142,
        notes: 'Brushed Silver Stainless Steel Smart Card issued to Staff Cloud Architect'
      },
      {
        cardUid: 'OWQ-NFC-89424',
        serialNumber: 'SN-2026-00104',
        cardType: 'pvc_matte',
        batchNumber: 'BATCH-2026-01',
        status: anjaliMember ? 'linked' : 'unassigned',
        memberId: anjaliMember ? anjaliMember._id : null,
        profileId: anjaliMember ? anjaliMember.profileId : null,
        linkedAt: anjaliMember ? new Date() : null,
        tapCount: 89,
        notes: 'Premium Matte Black PVC Smart Card issued to Principal Product Designer'
      },
      {
        cardUid: 'OWQ-NFC-89425',
        serialNumber: 'SN-2026-00105',
        cardType: 'bamboo_wood',
        batchNumber: 'BATCH-2026-01',
        status: kabirMember ? 'linked' : 'unassigned',
        memberId: kabirMember ? kabirMember._id : null,
        profileId: kabirMember ? kabirMember.profileId : null,
        linkedAt: kabirMember ? new Date() : null,
        tapCount: 115,
        notes: 'Eco Bamboo Wooden Laser-Engraved NFC Card issued to Enterprise Sales Director'
      },
      {
        cardUid: 'OWQ-NFC-89426',
        serialNumber: 'SN-2026-00106',
        cardType: 'metal_black',
        batchNumber: 'BATCH-2026-01',
        status: 'unassigned',
        memberId: null,
        profileId: null,
        notes: 'Stock Inventory - Ready for enterprise member pairing'
      },
      {
        cardUid: 'OWQ-NFC-89427',
        serialNumber: 'SN-2026-00107',
        cardType: 'pvc_matte',
        batchNumber: 'BATCH-2026-01',
        status: 'unassigned',
        memberId: null,
        profileId: null,
        notes: 'Stock Inventory - Ready for enterprise member pairing'
      },
      {
        cardUid: 'OWQ-NFC-89428',
        serialNumber: 'SN-2026-00108',
        cardType: 'pvc_glossy',
        batchNumber: 'BATCH-2026-01',
        status: 'unassigned',
        memberId: null,
        profileId: null,
        notes: 'Stock Inventory - Ready for enterprise member pairing'
      }
    ];

    await Card.insertMany(sampleCards);
    logger.info(`  [Cards] Successfully seeded ${sampleCards.length} smart NFC cards into inventory.`);
  } catch (error) {
    logger.error(`  [Cards] Failed to seed cards: ${error.message}`);
  }
};
