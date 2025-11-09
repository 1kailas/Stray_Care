import { useState } from 'react';
import { Heart, DollarSign, Calendar, Info, CheckCircle, Star, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface SponsorshipTier {
  id: string;
  name: string;
  amount: number;
  duration: 'monthly' | 'quarterly' | 'yearly' | 'one-time';
  benefits: string[];
  popular?: boolean;
}

interface SponsoreeDog {
  id: string;
  name: string;
  image: string;
  age: string;
  breed: string;
  story: string;
  medicalNeeds: string;
  monthlyExpense: number;
  currentSponsors: number;
  targetSponsors: number;
  location: string;
}

const sponsorshipTiers: SponsorshipTier[] = [
  {
    id: 'basic',
    name: 'Basic Care',
    amount: 500,
    duration: 'monthly',
    benefits: [
      'Monthly photo updates',
      'Sponsorship certificate',
      'Tax deduction receipt',
      'Thank you card from the dog'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Care',
    amount: 1500,
    duration: 'monthly',
    benefits: [
      'All Basic Care benefits',
      'Bi-weekly video updates',
      'Virtual meet & greet session',
      'Personalized health reports',
      'Sponsor badge on profile'
    ],
    popular: true
  },
  {
    id: 'guardian',
    name: 'Guardian Angel',
    amount: 3000,
    duration: 'monthly',
    benefits: [
      'All Premium Care benefits',
      'Weekly video calls',
      'In-person visits (if local)',
      'Name on kennel plaque',
      'Priority adoption rights',
      'Exclusive sponsor events access'
    ]
  },
  {
    id: 'one-time',
    name: 'One-Time Support',
    amount: 2000,
    duration: 'one-time',
    benefits: [
      'Photo update',
      'Thank you certificate',
      'Tax deduction receipt',
      'Social media recognition'
    ]
  }
];

const mockDogs: SponsoreeDog[] = [
  {
    id: '1',
    name: 'Rocky',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400',
    age: '5 years',
    breed: 'German Shepherd Mix',
    story: 'Rocky was rescued from a construction site with a broken leg. He has undergone surgery and is recovering well but needs continued medical care and physiotherapy.',
    medicalNeeds: 'Physiotherapy sessions, pain medication, regular check-ups',
    monthlyExpense: 4500,
    currentSponsors: 2,
    targetSponsors: 3,
    location: 'Mumbai Shelter'
  },
  {
    id: '2',
    name: 'Bella',
    image: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=400',
    age: '3 years',
    breed: 'Labrador',
    story: 'Bella is blind but full of life. She was abandoned because of her disability. She needs special care and a loving environment to thrive.',
    medicalNeeds: 'Eye care, special diet, regular vet visits',
    monthlyExpense: 3000,
    currentSponsors: 1,
    targetSponsors: 2,
    location: 'Delhi Shelter'
  },
  {
    id: '3',
    name: 'Charlie',
    image: 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=400',
    age: '7 years',
    breed: 'Indie Dog',
    story: 'Charlie is a senior dog with arthritis. He was found wandering the streets, malnourished and in pain. Now he is receiving the care he deserves.',
    medicalNeeds: 'Arthritis medication, special senior diet, comfort care',
    monthlyExpense: 2500,
    currentSponsors: 3,
    targetSponsors: 2,
    location: 'Bangalore Shelter'
  },
  {
    id: '4',
    name: 'Daisy',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    age: '2 years',
    breed: 'Beagle Mix',
    story: 'Daisy is recovering from severe mange and skin infections. She is slowly regaining her beautiful coat and confidence with proper treatment.',
    medicalNeeds: 'Skin treatments, medicated baths, nutritional supplements',
    monthlyExpense: 3500,
    currentSponsors: 1,
    targetSponsors: 2,
    location: 'Pune Shelter'
  }
];

export default function Sponsorship() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedDog, setSelectedDog] = useState<SponsoreeDog | null>(null);
  const [showSponsorForm, setShowSponsorForm] = useState(false);
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorEmail, setSponsorEmail] = useState('');
  const [sponsorPhone, setSponsorPhone] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSponsor = (dog: SponsoreeDog, tier: SponsorshipTier) => {
    setSelectedDog(dog);
    setSelectedTier(tier.id);
    setShowSponsorForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you for sponsoring ${selectedDog?.name}! Our team will contact you shortly.`);
    setShowSponsorForm(false);
    setSponsorName('');
    setSponsorEmail('');
    setSponsorPhone('');
    setCustomAmount('');
    setIsAnonymous(false);
  };

  const totalSponsored = mockDogs.reduce((acc, dog) => acc + (dog.currentSponsors * 1500), 0);
  const totalDogs = mockDogs.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-full mb-4">
            <Heart className="w-5 h-5" />
            <span className="font-semibold">Sponsorship Program</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Sponsor a Dog in Need
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Can't adopt but want to help? Become a sponsor! Your monthly contribution provides food,
            medical care, and shelter for dogs waiting for their forever homes.
          </p>
        </motion.div>

        {/* Impact Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <Users className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">248</div>
            <div className="text-gray-600 dark:text-gray-400">Active Sponsors</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <Heart className="w-8 h-8 text-pink-600 dark:text-pink-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{totalDogs}</div>
            <div className="text-gray-600 dark:text-gray-400">Dogs Sponsored</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">₹{totalSponsored.toLocaleString()}</div>
            <div className="text-gray-600 dark:text-gray-400">Monthly Support</div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 mb-12 text-white"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">How Sponsorship Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Choose a Dog</h3>
              <p className="text-sm opacity-90">Browse our dogs needing sponsorship</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Select a Plan</h3>
              <p className="text-sm opacity-90">Pick a sponsorship tier that fits your budget</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Make a Difference</h3>
              <p className="text-sm opacity-90">Your contribution provides essential care</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h3 className="font-semibold mb-2">Stay Connected</h3>
              <p className="text-sm opacity-90">Receive regular updates on your sponsored dog</p>
            </div>
          </div>
        </motion.div>

        {/* Sponsorship Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Sponsorship Plans
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {sponsorshipTiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative ${
                  tier.popular ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tier.name}</h3>
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    ₹{tier.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {tier.duration === 'monthly' && 'per month'}
                    {tier.duration === 'quarterly' && 'per quarter'}
                    {tier.duration === 'yearly' && 'per year'}
                    {tier.duration === 'one-time' && 'one-time'}
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {tier.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Dogs Available for Sponsorship */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Dogs Seeking Sponsors
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {mockDogs.map((dog, index) => (
              <motion.div
                key={dog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="relative h-64">
                  <img src={dog.image} alt={dog.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {dog.location}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{dog.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{dog.age} • {dog.breed}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Need</div>
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        ₹{dog.monthlyExpense.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4">{dog.story}</p>

                  <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white mb-1">Medical Needs:</div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">{dog.medicalNeeds}</div>
                      </div>
                    </div>
                  </div>

                  {/* Sponsor Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Sponsorship Progress</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {dog.currentSponsors}/{dog.targetSponsors} sponsors
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                        style={{ width: `${(dog.currentSponsors / dog.targetSponsors) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Sponsor Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleSponsor(dog, sponsorshipTiers[0])}
                      className="py-2 px-4 border-2 border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                    >
                      Basic • ₹500/mo
                    </button>
                    <button
                      onClick={() => handleSponsor(dog, sponsorshipTiers[1])}
                      className="py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Premium • ₹1500/mo
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sponsorship Form Modal */}
        {showSponsorForm && selectedDog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSponsorForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Sponsor {selectedDog.name}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={sponsorEmail}
                    onChange={(e) => setSponsorEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={sponsorPhone}
                    onChange={(e) => setSponsorPhone(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Custom Amount (Optional)
                  </label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter custom amount"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="anonymous" className="text-sm text-gray-700 dark:text-gray-300">
                    Make my sponsorship anonymous
                  </label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSponsorForm(false)}
                    className="flex-1 py-2 px-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Confirm Sponsorship
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Can I visit my sponsored dog?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! Premium and Guardian sponsors can schedule visits. Basic sponsors can arrange visits with prior notice.
              </p>
            </div>
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Is my sponsorship tax-deductible?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, we provide 80G certificates for all sponsorships. You'll receive your certificate via email.
              </p>
            </div>
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Can I sponsor multiple dogs?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Absolutely! You can sponsor as many dogs as you'd like. Each sponsorship makes a real difference.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What if my sponsored dog gets adopted?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We'll notify you and help you transfer your sponsorship to another dog in need, or you can choose to end your sponsorship.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
