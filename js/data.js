export const colors = [
  { id: 'espresso', name: 'Soft espresso', hex: '#392A27' },
  { id: 'chocolate', name: 'Chocolate brown', hex: '#694535' },
  { id: 'copper', name: 'Warm copper', hex: '#AA5F3C' },
  { id: 'honey', name: 'Honey blonde', hex: '#BC925A' },
  { id: 'rose', name: 'Rose brown', hex: '#9B6570' },
  { id: 'ash', name: 'Ash blonde', hex: '#B0A28C' },
];
export const looks = [
  { id: 'soft-bob', name: 'The soft bob', subtitle: 'A fresh start, beautifully simple.', length: 'short', texture: 'straight', color: 'chocolate', maintenance: 'low', shape: 'bob', tag: 'EVERYDAY ELEGANCE' },
  { id: 'copper-waves', name: 'Copper daydream', subtitle: 'Warmth with a little movement.', length: 'long', texture: 'wavy', color: 'copper', maintenance: 'high', shape: 'waves', tag: 'A LITTLE BOLDER' },
  { id: 'curly-shag', name: 'The curly shag', subtitle: 'Let your natural texture lead.', length: 'medium', texture: 'curly', color: 'espresso', maintenance: 'medium', shape: 'curly', tag: 'TEXTURE FIRST' },
  { id: 'honey-layers', name: 'Honey & layers', subtitle: 'Soft dimension. Effortless energy.', length: 'long', texture: 'wavy', color: 'honey', maintenance: 'high', shape: 'waves', tag: 'SOFT DIMENSION' },
  { id: 'pixie', name: 'The modern pixie', subtitle: 'Small length, big personality.', length: 'short', texture: 'straight', color: 'espresso', maintenance: 'medium', shape: 'pixie', tag: 'FRESH PERSPECTIVE' },
  { id: 'rose-lob', name: 'The rosy lob', subtitle: 'An understated touch of color.', length: 'medium', texture: 'straight', color: 'rose', maintenance: 'high', shape: 'bob', tag: 'COLOR CURIOSITY' },
  { id: 'coil-crown', name: 'Natural crown', subtitle: 'Shape that celebrates your coils.', length: 'medium', texture: 'coily', color: 'espresso', maintenance: 'medium', shape: 'coily', tag: 'NATURALLY YOU' },
  { id: 'ash-bob', name: 'The airy bob', subtitle: 'Clean lines, a cooler palette.', length: 'short', texture: 'wavy', color: 'ash', maintenance: 'high', shape: 'bob', tag: 'QUIET CONFIDENCE' },
];
export const courses = [
  { id: 'color', title: 'A little color theory', category: 'COLOR FOUNDATIONS', icon: '◉', description: 'Understand tone, depth, and the color wheel.', lessons: [
    { title: 'Depth and tone', text: 'Depth describes how light or dark a color appears. Tone describes its character: warm, cool, or neutral. Two browns can have similar depth but very different tones. Explore the swatches below and notice the difference between warm copper and cooler rose brown.', visual: 'swatches', question: 'What does color depth describe?', answers: ['How light or dark a color is', 'How curly the hair is', 'How long color lasts'], correct: 0, explanation: 'Depth is lightness or darkness; tone is the warm, cool, or neutral character.' },
    { title: 'Complementary colors', text: 'Opposite colors on a color wheel can help neutralize each other: violet and yellow, blue and orange, green and red. Hair is not a blank canvas; underlying pigment and porosity affect the outcome. This principle is a starting point for learning, not a formula for applying products.', visual: 'wheel', question: 'Which pair is complementary?', answers: ['Red and orange', 'Violet and yellow', 'Blue and green'], correct: 1, explanation: 'Violet and yellow sit opposite each other on the color wheel.' },
  ] },
  { id: 'cut', title: 'The shape of a great cut', category: 'CUTTING FUNDAMENTALS', icon: '✂', description: 'Discover shape, sections, and natural movement.', lessons: [
    { title: 'Shape before scissors', text: 'A haircut combines outline, weight, and movement. A blunt outline keeps visual weight near the ends, while layers distribute it through the shape. Consider your styling routine and natural texture when discussing a cut with your stylist.', visual: 'shapes', question: 'What is a useful starting point for choosing a cut?', answers: ['Copy every trend exactly', 'Consider natural texture and daily styling', 'Ignore maintenance'], correct: 1, explanation: 'A cut should suit both your texture and the time you want to spend styling.' },
    { title: 'Sections and shrinkage', text: 'Sectioning separates hair into manageable areas so a stylist can work consistently. Curly and coily hair may appear shorter when dry than when wet. Evaluate natural fall and shrinkage before deciding on length; a trained stylist can adapt the cut to these differences.', visual: 'shapes', question: 'Why consider shrinkage?', answers: ['It changes how long a dry cut appears', 'It changes natural pigment', 'It removes the need for sectioning'], correct: 0, explanation: 'Curl contraction can make dry hair look shorter than wet or stretched hair.' },
  ] },
  { id: 'technique', title: 'Dimension, thoughtfully', category: 'COLORING TECHNIQUES', icon: '〰', description: 'Meet highlights, balayage, and all-over color.', lessons: [
    { title: 'Placement creates dimension', text: 'Highlights brighten selected strands. Balayage describes a hand-painted placement approach. All-over color creates a more uniform change. Placement, starting color, and maintenance goals matter more than a trend name. Previously dyed or bleached hair needs an individual assessment.', visual: 'swatches', question: 'What does balayage describe?', answers: ['A guaranteed shade of blonde', 'A hand-painted placement approach', 'A universal processing time'], correct: 1, explanation: 'Balayage refers to placement technique, not a promised color result.' },
    { title: 'Plan a safe color appointment', text: 'Share your full dye and bleaching history with your colorist, including at-home products. Follow manufacturer instructions for patch and strand testing. Lightening and major color corrections may need several appointments; damaged hair may need a different plan.', visual: 'swatches', question: 'What should you share with a colorist?', answers: ['Only your desired shade', 'Only your most recent haircut', 'Your dye history and hair condition'], correct: 2, explanation: 'Past treatments and condition help a professional assess practical options.' },
  ] },
  { id: 'mixing', title: 'Mixing: the foundations', category: 'COLOR MIXING', icon: '⊕', description: 'Learn why formulas are product-specific.', lessons: [
    { title: 'A formula has context', text: 'Color products are designed as systems. Ratios, developer choices, and processing times depend on the exact manufacturer’s instructions and an assessment of the hair. Never combine different products simply because their shade labels look similar. Practice color relationships on paper instead.', visual: 'wheel', question: 'Where should mixing instructions come from?', answers: ['A universal internet recipe', 'The exact product’s manufacturer', 'The color of the packaging'], correct: 1, explanation: 'Follow the exact product system and seek professional guidance when unsure.' },
    { title: 'Porosity changes the picture', text: 'Porosity describes how readily hair takes up and loses moisture. Prior chemical treatments can affect it, and uneven condition can lead to uneven color uptake. A strand test and professional assessment are more useful than assuming a photo can reveal everything.', visual: 'swatches', question: 'What can help assess a potential color outcome?', answers: ['A strand test following product instructions', 'A photo alone', 'Using a longer time for every product'], correct: 0, explanation: 'A properly performed strand test can reveal information a photo cannot.' },
  ] },
  { id: 'care', title: 'Good hair starts with care', category: 'HAIR & AFTERCARE', icon: '✧', description: 'Build a gentle routine that works for you.', lessons: [
    { title: 'Keep your routine gentle', text: 'Choose cleansing and conditioning products for your hair and follow their labels. Detangle gently, avoid unnecessary pulling, and limit excessive heat. A sustainable routine fits your texture and daily life; more products do not automatically mean better care.', visual: 'shapes', question: 'Which habit supports a gentle routine?', answers: ['Pulling through tangles', 'Always using the highest heat', 'Detangling gently'], correct: 2, explanation: 'Gentle detangling helps avoid unnecessary mechanical stress.' },
    { title: 'Know when to ask for help', text: 'A stylist can help with maintenance and breakage concerns. Significant scalp irritation, injury, or unusual hair loss deserves qualified medical advice. HairLab does not diagnose scalp conditions. Stop using a product that causes a reaction and follow its safety instructions.', visual: 'shapes', question: 'Who should assess significant scalp irritation?', answers: ['A hairstyle filter', 'A qualified medical professional', 'A color-wheel quiz'], correct: 1, explanation: 'Scalp symptoms need qualified medical assessment, not an image-based guess.' },
  ] },
];
export function recommend(profile, feedback = {}) {
  return looks.map(look => ({ ...look, score:
    (look.texture === profile.texture ? 5 : 0) + (look.length === profile.length ? 5 : 0) +
    (profile.styles.includes(look.id) ? 4 : 0) + (look.color === profile.current ? 2 : 0) +
    (profile.goal === 'easy' && look.maintenance === 'low' ? 3 : 0) +
    (profile.goal === 'color' && look.color !== profile.current ? 2 : 0) +
    (feedback[look.id] === 'like' ? 3 : feedback[look.id] === 'dislike' ? -12 : 0)
  })).sort((a, b) => b.score - a.score).slice(0, 3);
}
export function profileAdvice(profile) {
  const messages = ['Suggestions use your selections and local feedback, not AI or photo analysis. Actual results vary with starting color, treatments, products, and technique.'];
  if (profile.condition !== 'good' || profile.history !== 'none') messages.push('Your reported condition or previous color calls for an individual stylist assessment. Catalog colors are inspiration; we do not recommend bleaching or color correction from this profile.');
  if (profile.natural !== profile.current) messages.push('Your natural and current colors differ. Tell your colorist how that change was achieved before planning another color.');
  messages.push('Follow product instructions for patch and strand testing. Seek professional help for major changes.');
  return messages;
}
