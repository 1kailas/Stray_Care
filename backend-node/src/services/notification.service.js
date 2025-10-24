import Notification from '../models/notification.model.js';

class NotificationService {
  async createNotification({ userId, title, message, type, relatedEntityId, relatedEntityType }) {
    try {
      const notification = new Notification({
        userId,
        title,
        message,
        type,
        relatedEntityId,
        relatedEntityType
      });

      await notification.save();
      return notification;
    } catch (error) {
      console.error('Notification creation error:', error);
      return null;
    }
  }

  async notifyCaseAssignment(dogReport, volunteer) {
    return this.createNotification({
      userId: volunteer.userId,
      title: 'New Case Assigned',
      message: `You have been assigned to case: ${dogReport.dogName || 'Unnamed dog'}`,
      type: 'CASE_ASSIGNED',
      relatedEntityId: dogReport._id.toString(),
      relatedEntityType: 'DOG_REPORT'
    });
  }

  async notifyVolunteerApproval(volunteer) {
    return this.createNotification({
      userId: volunteer.userId,
      title: 'Volunteer Application Approved',
      message: 'Congratulations! Your volunteer application has been approved.',
      type: 'VOLUNTEER_APPROVED',
      relatedEntityId: volunteer._id.toString(),
      relatedEntityType: 'VOLUNTEER'
    });
  }

  async notifyAdoptionUpdate(adoption, message) {
    return this.createNotification({
      userId: adoption.adopterId,
      title: 'Adoption Application Update',
      message,
      type: 'ADOPTION_UPDATE',
      relatedEntityId: adoption._id.toString(),
      relatedEntityType: 'ADOPTION'
    });
  }

  async notifyDonationReceived(donation) {
    if (!donation.donorId) return null;

    return this.createNotification({
      userId: donation.donorId,
      title: 'Donation Received',
      message: `Thank you for your donation of ₹${donation.amount}!`,
      type: 'DONATION_RECEIVED',
      relatedEntityId: donation._id.toString(),
      relatedEntityType: 'DONATION'
    });
  }

  async notifyCaseUpdate(dogReport, message) {
    if (!dogReport.reportedBy) return null;

    return this.createNotification({
      userId: dogReport.reportedBy,
      title: 'Case Update',
      message,
      type: 'CASE_UPDATE',
      relatedEntityId: dogReport._id.toString(),
      relatedEntityType: 'DOG_REPORT'
    });
  }
}

export default new NotificationService();
