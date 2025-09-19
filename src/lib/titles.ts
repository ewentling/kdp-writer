import { Text } from './text'

// SEO-optimized keywords for Amazon KDP
const SEO_KEYWORDS = {
  // High-impact power words
  powerWords: ['Complete', 'Ultimate', 'Essential', 'Comprehensive', 'Expert', 'Professional', 'Advanced', 'Master', 'Secrets', 'Proven'],
  
  // Popular search terms
  searchTerms: ['Guide', 'Handbook', 'Manual', 'Book', 'Course', 'Training', 'Tips', 'Tricks', 'Secrets', 'Strategies'],
  
  // Target audience modifiers
  audience: ['for Beginners', 'for Dummies', 'Made Simple', 'Step-by-Step', 'Easy', 'Quick Start', 'Complete Guide', 'Everything You Need'],
  
  // Trending modifiers (2024)
  trending: ['2024', 'Updated', 'Latest', 'New', 'Modern', 'Digital', 'Online', 'Virtual', 'Remote', 'Smart'],
  
  // Benefit-driven words
  benefits: ['Success', 'Results', 'Achieve', 'Master', 'Learn', 'Discover', 'Transform', 'Improve', 'Boost', 'Increase'],
  
  // Urgency/Scarcity
  urgency: ['Now', 'Today', 'Fast', 'Quick', 'Instant', 'Immediate', 'Rush', 'Limited', 'Exclusive', 'Special'],
  
  // Emotional triggers
  emotional: ['Amazing', 'Incredible', 'Unbelievable', 'Mind-Blowing', 'Life-Changing', 'Revolutionary', 'Breakthrough', 'Game-Changing']
}

// Category-specific keywords for better targeting
const CATEGORY_KEYWORDS = {
  business: ['Business', 'Entrepreneur', 'Startup', 'Marketing', 'Sales', 'Finance', 'Leadership', 'Management'],
  health: ['Health', 'Fitness', 'Wellness', 'Diet', 'Nutrition', 'Exercise', 'Mental Health', 'Self-Care'],
  technology: ['Tech', 'Digital', 'Software', 'Programming', 'AI', 'Apps', 'Online', 'Computer'],
  lifestyle: ['Life', 'Lifestyle', 'Personal', 'Self-Help', 'Motivation', 'Productivity', 'Habits', 'Mindfulness'],
  creative: ['Creative', 'Art', 'Design', 'Writing', 'Photography', 'Music', 'Craft', 'DIY'],
  education: ['Learning', 'Education', 'Study', 'Skills', 'Training', 'Course', 'Tutorial', 'How-To']
}

const toneFromTitle = (title: string) => {
  const t = title || ''
  if (/(Guide|Handbook|Companion|Made Simple|for Beginners|How to|Basics|Starter|Pocket|Complete|Ultimate)/i.test(t)) return 78
  if (/(Stories|Secrets|Journey|Adventures|Little Moments|Tales|Reflections|Memoir|Chronicles)/i.test(t)) return 22
  return 50
}

const deriveOutlineFromTitle = (title: string, subject: string, fiction: boolean) => {
  if (fiction) return [
    'Opening Scene','Character Introductions','Rising Action','Conflict & Obstacles','Climax','Falling Action','Resolution'
  ]
  const s = Text.safeClean(subject) || 'the topic'; const t = title || ''
  if (/(Guide|Handbook|Companion|Made Simple|for Beginners|How to|Basics|Starter|Pocket|Complete|Ultimate)/i.test(t)) return [
    `Introduction to ${s}`,'Quick Start','Tools & Materials','Core Techniques','Practice Exercises','Common Mistakes & Fixes','Checklists','Care & Maintenance','Next Steps'
  ]
  if (/(Stories|Secrets|Journey|Adventures|Little Moments|Tales|Reflections|Memoir|Chronicles)/i.test(t)) return [
    `Why ${s} Matters`,'First Encounters','Learning the Hard Way','Little Anecdotes','Community Voices','Rituals & Habits','Reflections','Keeping the Spark Alive'
  ]
  return [
    'Introduction','History & Background','Tools & Materials','Getting Started','Tips & Techniques','Enjoyment & Community','Challenges & How to Overcome Them','Memorable Experiences','Conclusion & Next Steps'
  ]
}

// Extract keywords from subject to improve SEO targeting
const extractSubjectKeywords = (subject: string) => {
  const clean = Text.safeClean(subject).toLowerCase()
  const keywords = []
  
  // Check for category matches
  for (const [category, terms] of Object.entries(CATEGORY_KEYWORDS)) {
    if (terms.some(term => clean.includes(term.toLowerCase()))) {
      keywords.push(...terms.slice(0, 2)) // Take first 2 terms from matching category
    }
  }
  
  // Add subject itself as primary keyword
  keywords.unshift(clean)
  
  return keywords.slice(0, 3) // Limit to 3 keywords
}

// Calculate SEO score for a title
const calculateSEOScore = (title: string) => {
  const analysis = {
    length: title.length,
    hasPowerWords: /(Complete|Ultimate|Essential|Comprehensive|Expert|Professional|Advanced|Master|Secrets|Proven)/i.test(title),
    hasNumbers: /\d+/.test(title),
    hasHowTo: /how to/i.test(title),
    hasBenefits: /(Success|Results|Achieve|Master|Learn|Discover|Transform|Improve|Boost|Increase)/i.test(title),
    hasAudience: /(for Beginners|for Dummies|Made Simple|Step-by-Step|Easy|Quick Start|Complete Guide|Everything You Need)/i.test(title),
    hasUrgency: /(Now|Today|Fast|Quick|Instant|Immediate|Rush|Limited|Exclusive|Special)/i.test(title),
    hasEmotional: /(Amazing|Incredible|Unbelievable|Mind-Blowing|Life-Changing|Revolutionary|Breakthrough|Game-Changing)/i.test(title)
  }
  
  let score = 0
  if (analysis.length >= 30 && analysis.length <= 60) score += 20
  if (analysis.hasPowerWords) score += 15
  if (analysis.hasNumbers) score += 10
  if (analysis.hasHowTo) score += 15
  if (analysis.hasBenefits) score += 10
  if (analysis.hasAudience) score += 10
  if (analysis.hasUrgency) score += 10
  if (analysis.hasEmotional) score += 10
  
  return Math.min(score, 100)
}

// Generate creative, grammatically correct, SEO-optimized titles (minimum 50 SEO score)
const suggestTitles = (subject: string, regenerationCount = 0) => {
  const base = subject.trim()
  let clean = Text.safeClean(base)
  if (!clean) clean = 'Your Topic'
  
  const subjectKeywords = extractSubjectKeywords(subject)
  const titles = new Set<string>()
  
  // Creative word pools with much more variety
  const powerWords = ['Complete', 'Ultimate', 'Essential', 'Comprehensive', 'Advanced', 'Professional', 'Expert', 'Master', 'Revolutionary', 'Breakthrough', 'Proven', 'Time-Tested', 'Modern', 'Cutting-Edge', 'Incredible', 'Amazing']
  const searchTerms = ['Guide', 'Handbook', 'Manual', 'Book', 'Course', 'Training', 'Tips', 'Strategies', 'Secrets', 'Methods', 'Techniques', 'Approach', 'System', 'Blueprint', 'Roadmap', 'Playbook']
  const actionWords = ['Master', 'Learn', 'Understand', 'Practice', 'Excel at', 'Dominate', 'Conquer', 'Transform', 'Revolutionize', 'Perfect', 'Unlock', 'Discover', 'Explore', 'Navigate', 'Journey through']
  const emotionalWords = ['Amazing', 'Incredible', 'Unbelievable', 'Mind-Blowing', 'Life-Changing', 'Revolutionary', 'Breakthrough', 'Game-Changing', 'Stunning', 'Remarkable', 'Extraordinary', 'Phenomenal', 'Spectacular', 'Outstanding', 'Exceptional']
  const timeWords = ['in 30 Days', 'in 21 Days', 'in 7 Days', 'in 90 Days', 'in 1 Week', 'in 2 Weeks', 'in 1 Month', 'in 3 Months', 'Fast', 'Quick', 'Instant', 'Immediate', 'Overnight', 'Rapid', 'Accelerated']
  const benefitWords = ['Success', 'Results', 'Achievement', 'Mastery', 'Excellence', 'Greatness', 'Victory', 'Triumph', 'Prosperity', 'Abundance', 'Freedom', 'Independence', 'Confidence', 'Power', 'Control']
  
  // Create a seeded random function for consistent but varied results
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }
  
  // Generate unique seed for this regeneration
  const baseSeed = Date.now() + regenerationCount * 1000 + clean.length * 100
  let seedCounter = 0
  const random = () => seededRandom(baseSeed + (seedCounter++))
  
  // Strategy 1: Creative Power Word combinations
  const selectedPowers = powerWords.sort(() => random() - 0.5).slice(0, 4)
  const selectedSearch = searchTerms.sort(() => random() - 0.5).slice(0, 4)
  
  selectedPowers.forEach(power => {
    selectedSearch.forEach(search => {
      const title = `${power} ${clean} ${search}`
      if (calculateSEOScore(title) >= 50) {
        titles.add(title)
      }
    })
  })
  
  // Strategy 2: Creative How-To formats with random action words
  const selectedActions = actionWords.sort(() => random() - 0.5).slice(0, 4)
  selectedActions.forEach(verb => {
    const title = `How to ${verb} ${clean}: A Complete Guide`
    if (calculateSEOScore(title) >= 50) {
      titles.add(title)
    }
  })
  
  // Strategy 3: Creative audience modifiers
  const audienceModifiers = ['for Beginners', 'Made Simple', 'Step-by-Step', 'for Dummies', 'for Newcomers', 'Made Easy', 'Simplified', 'Demystified', 'Uncomplicated', 'Streamlined']
  const selectedAudience = audienceModifiers.sort(() => random() - 0.5).slice(0, 3)
  selectedAudience.forEach(audience => {
    const title = `${clean} ${audience}: Everything You Need to Know`
    if (calculateSEOScore(title) >= 50) {
      titles.add(title)
    }
  })
  
  // Strategy 4: Creative numbered lists with random numbers and descriptors
  const numbers = ['7', '10', '21', '30', '50', '101', '365', '12']
  const descriptors = ['Essential', 'Powerful', 'Game-Changing', 'Life-Altering', 'Revolutionary', 'Mind-Blowing', 'Incredible', 'Amazing']
  const selectedNumbers = numbers.sort(() => random() - 0.5).slice(0, 2)
  const selectedDescriptors = descriptors.sort(() => random() - 0.5).slice(0, 2)
  
  selectedNumbers.forEach(num => {
    selectedDescriptors.forEach(desc => {
      const title = `${num} ${desc} ${clean} Tips That Will Change Your Life`
      if (calculateSEOScore(title) >= 50) {
        titles.add(title)
      }
    })
  })
  
  // Strategy 5: Creative mastery formats with random time and benefit words
  const selectedTime = timeWords.sort(() => random() - 0.5).slice(0, 2)
  const selectedBenefit = benefitWords.sort(() => random() - 0.5).slice(0, 2)
  
  selectedTime.forEach(time => {
    selectedBenefit.forEach(benefit => {
      const title = `Master ${clean} ${time}: Proven Methods for ${benefit}`
      if (calculateSEOScore(title) >= 50) {
        titles.add(title)
      }
    })
  })
  
  // Strategy 6: Creative problem-solution formats
  const problemWords = ['Problems', 'Challenges', 'Obstacles', 'Struggles', 'Difficulties', 'Hurdles', 'Barriers']
  const solutionWords = ['Solution', 'Answers', 'Secrets', 'Methods', 'Techniques', 'Strategies', 'Approaches']
  const selectedProblem = problemWords.sort(() => random() - 0.5).slice(0, 2)
  const selectedSolution = solutionWords.sort(() => random() - 0.5).slice(0, 2)
  
  selectedProblem.forEach(problem => {
    selectedSolution.forEach(solution => {
      const title = `${clean} ${problem} Solved: The Ultimate ${solution} Guide`
      if (calculateSEOScore(title) >= 50) {
        titles.add(title)
      }
    })
  })
  
  // Strategy 7: Creative emotional and professional formats
  const selectedEmotional = emotionalWords.sort(() => random() - 0.5).slice(0, 3)
  selectedEmotional.forEach(emotion => {
    const title = `${emotion} ${clean} Secrets: Proven Methods for Success`
    if (calculateSEOScore(title) >= 50) {
      titles.add(title)
    }
  })
  
  // Strategy 8: Creative trending and modern formats
  const trendingWords = ['2024', 'Modern', 'Contemporary', 'Latest', 'Updated', 'New', 'Fresh', 'Cutting-Edge']
  const selectedTrending = trendingWords.sort(() => random() - 0.5).slice(0, 2)
  selectedTrending.forEach(trend => {
    const title = `${clean} ${trend}: The Complete Updated Guide`
    if (calculateSEOScore(title) >= 50) {
      titles.add(title)
    }
  })
  
  // Strategy 9: Creative category-specific targeting
  if (subjectKeywords.length > 1) {
    const category = subjectKeywords[1]
    const categoryTitles = [
      `${category} ${clean}: Everything You Need to Know`,
      `The Ultimate ${category} Guide to ${clean}`,
      `${clean} for ${category} Professionals: Expert Methods`,
      `Master ${clean} in ${category}: Advanced Techniques`,
      `${clean} ${category} Mastery: Professional Strategies`
    ]
    
    const selectedCategoryTitles = categoryTitles.sort(() => random() - 0.5).slice(0, 2)
    selectedCategoryTitles.forEach(title => {
      if (calculateSEOScore(title) >= 50) {
        titles.add(title)
      }
    })
  }
  
  // Strategy 10: Completely random creative combinations
  const randomCombinations = []
  for (let i = 0; i < 5; i++) {
    const power = powerWords[Math.floor(Math.random() * powerWords.length)]
    const action = actionWords[Math.floor(Math.random() * actionWords.length)]
    const benefit = benefitWords[Math.floor(Math.random() * benefitWords.length)]
    const emotion = emotionalWords[Math.floor(Math.random() * emotionalWords.length)]
    
    const combinations = [
      `${emotion} ${clean}: How to ${action} for ${benefit}`,
      `The ${power} ${clean} ${action} Guide: Achieve ${benefit}`,
      `${clean} ${action}: ${power} Methods for ${benefit}`,
      `${emotion} ${clean} Mastery: ${power} Techniques for ${benefit}`,
      `Transform Your ${clean}: ${power} ${action} Strategies`
    ]
    
    randomCombinations.push(combinations[i % combinations.length])
  }
  
  randomCombinations.forEach(title => {
    if (calculateSEOScore(title) >= 50) {
      titles.add(title)
    }
  })
  
  // Convert Set to Array and ensure we have enough titles
  let titleArray = Array.from(titles)
  
  // If we don't have enough titles, add more creative grammatically correct ones
  while (titleArray.length < 8) {
    const power = powerWords[Math.floor(Math.random() * powerWords.length)]
    const search = searchTerms[Math.floor(Math.random() * searchTerms.length)]
    const action = actionWords[Math.floor(Math.random() * actionWords.length)]
    const benefit = benefitWords[Math.floor(Math.random() * benefitWords.length)]
    const emotion = emotionalWords[Math.floor(Math.random() * emotionalWords.length)]
    
    const creativeFallbacks = [
      `${power} ${clean} ${search}: Master the Basics`,
      `How to ${action} ${clean}: A Professional Guide`,
      `The ${power} ${clean} ${search}: Everything You Need to Know`,
      `${clean} ${search}: ${power} Methods and Techniques`,
      `${emotion} ${clean} Journey: From Beginner to Expert`,
      `Unlock ${clean} Mastery: ${power} Strategies for ${benefit}`,
      `The ${power} Art of ${clean}: Professional Techniques`,
      `${clean} Revolution: ${emotion} Methods for ${benefit}`,
      `Transform Your ${clean}: ${power} ${action} Guide`,
      `${emotion} ${clean} Secrets: Achieve ${benefit} Fast`
    ]
    
    const fallback = creativeFallbacks[Math.floor(Math.random() * creativeFallbacks.length)]
    if (calculateSEOScore(fallback) >= 50 && !titleArray.includes(fallback)) {
      titleArray.push(fallback)
    }
  }
  
  // Return titles sorted by SEO score (highest first)
  return titleArray
    .sort((a, b) => calculateSEOScore(b) - calculateSEOScore(a))
    .slice(0, 8)
}

export const Titles = { toneFromTitle, deriveOutlineFromTitle, suggestTitles }
