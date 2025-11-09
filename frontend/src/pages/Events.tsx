import { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Heart, Share2, Bell, Filter, Search, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Event {
  id: string;
  title: string;
  type: 'adoption-drive' | 'awareness' | 'fundraiser' | 'medical-camp' | 'workshop';
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  organizer: string;
  attendees: number;
  maxAttendees: number;
  isRegistered: boolean;
  featured?: boolean;
  tags: string[];
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Weekend Adoption Drive',
    type: 'adoption-drive',
    date: '2024-12-20',
    time: '10:00 AM - 4:00 PM',
    location: 'Phoenix Mall, Mumbai',
    description: 'Meet 20+ adorable dogs looking for their forever homes! Our volunteers will be present to help you find your perfect match. Free adoption counseling and home visit assistance provided.',
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800',
    organizer: 'StrayDogCare Mumbai Team',
    attendees: 45,
    maxAttendees: 100,
    isRegistered: false,
    featured: true,
    tags: ['Adoption', 'Family Friendly', 'Free Entry']
  },
  {
    id: '2',
    title: 'Street Dog Awareness Workshop',
    type: 'workshop',
    date: '2024-12-15',
    time: '2:00 PM - 5:00 PM',
    location: 'Community Center, Delhi',
    description: 'Learn about street dog behavior, safety, and how to help. Expert veterinarians and animal behaviorists will share insights on coexisting with street dogs and emergency care.',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800',
    organizer: 'Dr. Priya Sharma',
    attendees: 28,
    maxAttendees: 50,
    isRegistered: true,
    tags: ['Educational', 'Free', 'Certification']
  },
  {
    id: '3',
    title: 'Charity Run for Paws',
    type: 'fundraiser',
    date: '2024-12-22',
    time: '6:00 AM - 9:00 AM',
    location: 'Cubbon Park, Bangalore',
    description: '5K charity run to raise funds for medical treatment of injured street dogs. Registration fee: ₹500. All participants get a t-shirt and medal. Dogs welcome!',
    image: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=800',
    organizer: 'Run for Paws Foundation',
    attendees: 156,
    maxAttendees: 300,
    isRegistered: false,
    featured: true,
    tags: ['Fundraiser', 'Sports', 'Dog Friendly']
  },
  {
    id: '4',
    title: 'Free Vaccination Camp',
    type: 'medical-camp',
    date: '2024-12-18',
    time: '9:00 AM - 3:00 PM',
    location: 'ABC Nagar, Pune',
    description: 'Free vaccination and deworming camp for street dogs. Bring your community dogs! Our veterinary team will provide rabies vaccination, anti-rabies shots, and basic health checkups.',
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800',
    organizer: 'Pune Animal Welfare',
    attendees: 34,
    maxAttendees: 80,
    isRegistered: false,
    tags: ['Medical', 'Free', 'Community Service']
  },
  {
    id: '5',
    title: 'Pet Photography Session',
    type: 'awareness',
    date: '2024-12-25',
    time: '11:00 AM - 2:00 PM',
    location: 'Marine Drive, Mumbai',
    description: 'Professional photography session for adopted dogs to create awareness. Share your success stories and help inspire more adoptions. Professional photos provided free!',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
    organizer: 'Paws & Pixels',
    attendees: 22,
    maxAttendees: 40,
    isRegistered: false,
    tags: ['Photography', 'Awareness', 'Free']
  },
  {
    id: '6',
    title: 'Dog Training Workshop',
    type: 'workshop',
    date: '2024-12-28',
    time: '3:00 PM - 6:00 PM',
    location: 'Green Park, Delhi',
    description: 'Basic obedience training workshop for new dog parents. Learn essential commands, leash training, and behavioral management. Bring your dogs along!',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
    organizer: 'Canine Academy India',
    attendees: 18,
    maxAttendees: 25,
    isRegistered: false,
    featured: true,
    tags: ['Training', 'Educational', 'Hands-on']
  }
];

const eventTypeColors = {
  'adoption-drive': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  'awareness': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'fundraiser': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'medical-camp': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'workshop': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
};

const eventTypeLabels = {
  'adoption-drive': 'Adoption Drive',
  'awareness': 'Awareness Campaign',
  'fundraiser': 'Fundraiser',
  'medical-camp': 'Medical Camp',
  'workshop': 'Workshop'
};

export default function Events() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyRegistered, setShowOnlyRegistered] = useState(false);
  const [events, setEvents] = useState(mockEvents);

  const filteredEvents = events.filter(event => {
    const matchesType = !selectedType || event.type === selectedType;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegistered = !showOnlyRegistered || event.isRegistered;
    return matchesType && matchesSearch && matchesRegistered;
  });

  const upcomingEvents = filteredEvents.filter(event => new Date(event.date) >= new Date());
  const pastEvents = filteredEvents.filter(event => new Date(event.date) < new Date());

  const handleRegister = (eventId: string) => {
    setEvents(events.map(event =>
      event.id === eventId ? { ...event, isRegistered: !event.isRegistered, attendees: event.isRegistered ? event.attendees - 1 : event.attendees + 1 } : event
    ));
  };

  const handleShare = (event: Event) => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      });
    } else {
      alert('Event link copied to clipboard!');
    }
  };

  const totalUpcoming = upcomingEvents.length;
  const totalRegistered = events.filter(e => e.isRegistered).length;
  const totalAttendees = events.reduce((acc, e) => acc + e.attendees, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full mb-4">
            <Calendar className="w-5 h-5" />
            <span className="font-semibold">Events & Campaigns</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Join Our Community Events
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Participate in adoption drives, awareness campaigns, and community events.
            Together, we can make a difference in the lives of stray dogs.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{totalUpcoming}</div>
            <div className="text-gray-600 dark:text-gray-400">Upcoming Events</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{totalRegistered}</div>
            <div className="text-gray-600 dark:text-gray-400">Your Registrations</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <Users className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{totalAttendees}</div>
            <div className="text-gray-600 dark:text-gray-400">Total Attendees</div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events by title, location, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedType || ''}
                onChange={(e) => setSelectedType(e.target.value || null)}
                className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white appearance-none cursor-pointer"
              >
                <option value="">All Event Types</option>
                {Object.entries(eventTypeLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyRegistered}
                onChange={(e) => setShowOnlyRegistered(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Show only my registrations</span>
            </label>
          </div>
        </motion.div>

        {/* Featured Events */}
        {upcomingEvents.filter(e => e.featured).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-500" />
              Featured Events
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingEvents.filter(e => e.featured).map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow ring-2 ring-blue-500"
                >
                  <div className="relative h-48">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      Featured
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${eventTypeColors[event.type]}`}>
                          {eventTypeLabels[event.type]}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{event.attendees}/{event.maxAttendees} attendees</span>
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">{event.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleRegister(event.id)}
                        className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                          event.isRegistered
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {event.isRegistered ? (
                          <>
                            <CheckCircle className="w-4 h-4 inline-block mr-1" />
                            Registered
                          </>
                        ) : (
                          <>
                            <Bell className="w-4 h-4 inline-block mr-1" />
                            Register Now
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleShare(event)}
                        className="p-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Upcoming Events */}
        {upcomingEvents.filter(e => !e.featured).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Upcoming Events</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {upcomingEvents.filter(e => !e.featured).map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-40">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    {event.isRegistered && (
                      <div className="absolute top-2 right-2 bg-green-600 text-white p-1 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2 ${eventTypeColors[event.type]}`}>
                      {eventTypeLabels[event.type]}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{event.title}</h3>

                    <div className="space-y-1 mb-3 text-xs">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-3 h-3" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Users className="w-3 h-3" />
                        <span>{event.attendees}/{event.maxAttendees}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRegister(event.id)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                          event.isRegistered
                            ? 'bg-green-600 text-white'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {event.isRegistered ? 'Registered' : 'Register'}
                      </button>
                      <button
                        onClick={() => handleShare(event)}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No events found</h3>
            <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white"
        >
          <Calendar className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Want to Organize an Event?</h2>
          <p className="text-lg mb-6 opacity-90">
            Partner with us to organize adoption drives, awareness campaigns, or fundraisers in your community.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Submit Event Proposal
          </button>
        </motion.div>
      </div>
    </div>
  );
}
