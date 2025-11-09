import { useState } from 'react';
import { Heart, Calendar, MapPin, User, Search, Filter, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SuccessStory {
  id: string;
  dogName: string;
  beforeImage: string;
  afterImage: string;
  rescueDate: string;
  adoptionDate: string;
  location: string;
  adopterName: string;
  story: string;
  testimonial: string;
  tags: string[];
}

const mockStories: SuccessStory[] = [
  {
    id: '1',
    dogName: 'Bruno',
    beforeImage: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400',
    afterImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    rescueDate: '2024-01-15',
    adoptionDate: '2024-03-20',
    location: 'Mumbai, India',
    adopterName: 'Priya Sharma',
    story: 'Bruno was found severely malnourished and scared on the streets. After months of care, rehabilitation, and lots of love, he transformed into the happiest dog.',
    testimonial: 'Adopting Bruno was the best decision of my life. He brought so much joy to our family. Thank you StrayDogCare for this beautiful journey!',
    tags: ['Rescued', 'Transformation', 'Happy Ending']
  },
  {
    id: '2',
    dogName: 'Bella',
    beforeImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400',
    afterImage: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400',
    rescueDate: '2024-02-10',
    adoptionDate: '2024-04-05',
    location: 'Delhi, India',
    adopterName: 'Rahul Verma',
    story: 'Bella had a broken leg and was abandoned. Our medical team worked tirelessly to help her recover. Now she runs and plays like never before.',
    testimonial: 'Bella is a fighter and an inspiration. She taught us the true meaning of resilience. We are grateful to the entire team!',
    tags: ['Medical Recovery', 'Brave', 'Second Chance']
  },
  {
    id: '3',
    dogName: 'Max',
    beforeImage: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400',
    afterImage: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
    rescueDate: '2023-12-05',
    adoptionDate: '2024-02-14',
    location: 'Bangalore, India',
    adopterName: 'Anjali Patel',
    story: 'Max was timid and fearful when we found him. With patience and love, he learned to trust again and became the most affectionate companion.',
    testimonial: 'Max has changed our lives completely. He is not just a pet, he is family. Thank you for giving us this precious gift!',
    tags: ['Trust Building', 'Love Story', 'Family']
  },
  {
    id: '4',
    dogName: 'Luna',
    beforeImage: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400',
    afterImage: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400',
    rescueDate: '2024-01-20',
    adoptionDate: '2024-03-15',
    location: 'Pune, India',
    adopterName: 'Karan Mehta',
    story: 'Luna was pregnant and homeless when rescued. She gave birth to 5 healthy puppies in our shelter, and all found loving homes including Luna herself.',
    testimonial: 'Luna is the sweetest soul. Watching her thrive in a safe environment has been incredible. Forever grateful!',
    tags: ['Mother', 'New Beginning', 'Complete Recovery']
  }
];

export default function SuccessStories() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showBeforeAfter, setShowBeforeAfter] = useState<{ [key: string]: boolean }>({});

  const allTags = Array.from(new Set(mockStories.flatMap(story => story.tags)));

  const filteredStories = mockStories.filter(story => {
    const matchesSearch = story.dogName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.adopterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || story.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const toggleBeforeAfter = (id: string) => {
    setShowBeforeAfter(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const shareStory = (story: SuccessStory) => {
    if (navigator.share) {
      navigator.share({
        title: `Success Story: ${story.dogName}`,
        text: story.story,
        url: window.location.href
      });
    } else {
      alert('Story link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 px-4 py-2 rounded-full mb-4">
            <Heart className="w-5 h-5" />
            <span className="font-semibold">Success Stories</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Tales of Hope & Transformation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Every rescue has a story. Every adoption changes lives. Discover the incredible journeys
            of dogs who found their forever homes.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by dog name, adopter, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Tag Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedTag || ''}
                onChange={(e) => setSelectedTag(e.target.value || null)}
                className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white appearance-none cursor-pointer"
              >
                <option value="">All Stories</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {selectedTag && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active filter:</span>
              <span className="inline-flex items-center gap-1 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 px-3 py-1 rounded-full text-sm">
                {selectedTag}
                <button onClick={() => setSelectedTag(null)} className="hover:bg-pink-200 dark:hover:bg-pink-800 rounded-full p-0.5">
                  ×
                </button>
              </span>
            </div>
          )}
        </motion.div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
            >
              {/* Before/After Images */}
              <div className="relative h-64 overflow-hidden cursor-pointer group" onClick={() => toggleBeforeAfter(story.id)}>
                <motion.img
                  src={showBeforeAfter[story.id] ? story.beforeImage : story.afterImage}
                  alt={story.dogName}
                  className="w-full h-full object-cover"
                  initial={false}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {showBeforeAfter[story.id] ? 'Before' : 'After'}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-semibold">Click to toggle Before/After</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{story.dogName}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {story.tags.map(tag => (
                        <span key={tag} className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 px-2 py-1 rounded text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => shareStory(story)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    title="Share story"
                  >
                    <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Timeline */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Rescued: {new Date(story.rescueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <span>Adopted: {new Date(story.adoptionDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Location and Adopter */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{story.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{story.adopterName}</span>
                  </div>
                </div>

                {/* Story */}
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {story.story}
                </p>

                {/* Testimonial */}
                <div className="bg-pink-50 dark:bg-pink-900/20 border-l-4 border-pink-500 p-4 rounded">
                  <p className="text-gray-700 dark:text-gray-300 italic">
                    "{story.testimonial}"
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-semibold">
                    - {story.adopterName}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredStories.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No stories found</h3>
            <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-8 text-center text-white"
        >
          <Heart className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Want to Create Your Own Success Story?</h2>
          <p className="text-lg mb-6 opacity-90">
            Every dog deserves a loving home. Start your adoption journey today and change a life forever.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Browse Adoptable Dogs
            </button>
            <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Share Your Story
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
