// Personal finance · Thinking in numbers · Space & physics
// Compact format: L(id, title, [cards], takeaway, [Q(question, right, [3 wrong], why)])
import { L, Q } from "./make.js";

export const money = {
  id: "money", title: "Your money", tag: "Personal finance", icon: "💳", color: "#19b86b",
  blurb: "Budgets, credit, retirement accounts and taxes: the practical side of money nobody teaches.",
  lessons: [
    L("mon-1", "A budget that fits on a napkin", [
      "A budget is a plan for where your money goes before it's gone. The simplest useful one is 50/30/20: about half of take-home pay to needs (rent, groceries, insurance, minimum debt payments), 30% to wants, 20% to savings and extra debt payments.",
      "The exact split matters less than the order. Pay yourself first: move the savings share out automatically on payday, then spend what's left. People who save whatever remains at the end of the month usually find nothing remains.",
      "The first savings goal is an emergency fund: three to six months of essential expenses in an account you can reach quickly. It isn't an investment. It's what stops a car repair or a lost job from becoming credit-card debt.",
    ], "Decide the split before the month starts, automate the saving, and build a cash buffer before anything fancier.", [
      Q("In the 50/30/20 rule, what is the 20% for?", "Savings and extra debt payments", ["Rent and groceries", "Entertainment", "Taxes"], "50% needs, 30% wants, 20% savings and paying debt down faster."),
      Q("What does “pay yourself first” mean?", "Move money to savings automatically before you spend", ["Buy what you want before paying bills", "Pay off the smallest debt first", "Take your salary in cash"], "Saving first, on payday, beats trying to save whatever is left."),
      Q("What is an emergency fund for?", "Covering surprises without going into debt", ["Earning the highest return", "Paying for holidays", "Buying stocks when they dip"], "It is insurance, held in cash you can reach quickly."),
    ]),
    L("mon-2", "Credit scores and credit cards", [
      "A credit score is a number, usually 300 to 850 in the US, that tells lenders how likely you are to repay. It affects whether you get a loan or an apartment and what interest rate you pay. On a mortgage, a better score can save tens of thousands of dollars.",
      "Two things drive most of it. Payment history: paying on time, every time, is the biggest factor. Utilisation: how much of your available credit you use. Keeping balances under about 30% of your limits helps, and lower is better. Length of history, new applications and mix of credit matter less.",
      "A credit card is a short-term loan. Pay the full statement balance by the due date and you pay no interest at all. Pay only the minimum and the rest is charged at rates that often exceed 20% a year. Used the first way, a card builds your score for free.",
    ], "Pay on time, keep balances low, and pay the statement in full. That is most of the credit game.", [
      Q("What is the single biggest factor in a credit score?", "Paying on time", ["Your income", "How many cards you have", "Your age"], "Payment history carries the most weight. Income is not part of the score at all."),
      Q("How do you use a credit card without ever paying interest?", "Pay the full statement balance by the due date", ["Pay the minimum each month", "Keep a small balance on it", "Only use it online"], "Interest is charged on balances carried past the due date."),
      Q("What is credit utilisation?", "The share of your available credit you are using", ["The number of cards you hold", "How often you check your score", "Your total debt divided by income"], "Using a small share of your limits signals you are not stretched."),
    ]),
    L("mon-3", "Retirement accounts and free money", [
      "A 401(k) is a retirement account offered through an employer. Money goes in straight from your paycheck and is invested. An IRA is a similar account you open yourself. Both exist because the government gives them tax advantages to encourage saving.",
      "Many employers match contributions: put in 4% of your salary, say, and they add another 4%. That is an instant 100% return. Not contributing enough to get the full match is turning down part of your pay.",
      "The main choice is traditional versus Roth. Traditional: no tax on the money going in, tax when you take it out. Roth: you pay tax now, and withdrawals in retirement are tax-free. Roth tends to suit people who expect to be in a higher tax bracket later, which often means the young.",
    ], "Take the full employer match first. Then choose Roth or traditional based on whether your tax rate is likely to be higher now or later.", [
      Q("Why is an employer 401(k) match so valuable?", "It is an immediate return on money you contribute", ["It is tax-free forever", "It can be spent right away", "It raises your credit score"], "A dollar-for-dollar match doubles your contribution on day one."),
      Q("When are Roth contributions taxed?", "Now, when the money goes in", ["When you withdraw in retirement", "Never", "Only if you lose money"], "Roth: tax now, tax-free later. Traditional is the reverse."),
      Q("Who usually benefits most from a Roth account?", "Someone who expects a higher tax bracket later", ["Someone about to retire", "Someone in their peak earning years", "Someone with no income"], "Paying tax at today's lower rate beats paying at a higher one later."),
    ]),
    L("mon-4", "How income tax brackets actually work", [
      "The US taxes income in layers called brackets. Each layer has its own rate, and the rate applies only to the dollars inside that layer. This is a marginal system: your marginal rate is the rate on your last, highest dollar.",
      "So a raise never lowers your take-home pay because of brackets. If a bracket changes at $50,000 and you earn $51,000, only the extra $1,000 is taxed at the higher rate. Everything below is taxed exactly as before.",
      "Two tools cut the bill. A deduction lowers the income that gets taxed, so its value depends on your bracket: a $1,000 deduction saves $220 in the 22% bracket. A credit comes straight off the tax owed: a $1,000 credit saves $1,000. Your effective rate, total tax over total income, is always below your marginal rate.",
    ], "Higher rates apply only to the dollars above each threshold. A credit cuts your tax dollar for dollar; a deduction cuts it by your marginal rate.", [
      Q("You get a raise that pushes you into a higher bracket. What happens?", "Only the income above the threshold is taxed at the higher rate", ["All your income is taxed at the higher rate", "Your take-home pay falls", "You owe a one-off penalty"], "Brackets are marginal. Earlier dollars keep their lower rates."),
      Q("Which is worth more to someone in the 22% bracket?", "A $1,000 tax credit", ["A $1,000 deduction", "They are worth the same", "Neither has any value"], "The credit saves $1,000. The deduction saves 22% of $1,000, or $220."),
      Q("What is your effective tax rate?", "Total tax divided by total income", ["The rate on your last dollar", "The highest rate in the tax code", "The rate on investment income"], "It blends all the layers, so it sits below your marginal rate."),
    ]),
  ],
};

export const numbers = {
  id: "numbers", title: "Thinking in numbers", tag: "Statistics", icon: "🎲", color: "#f59e0b",
  blurb: "Four ideas from probability and statistics that stop you being fooled by data, headlines and your own gut.",
  lessons: [
    L("num-1", "Base rates", [
      "A disease affects 1 person in 1,000. A test catches every case but also gives a false positive 5% of the time. You test positive. What's the chance you have it? Most people say about 95%.",
      "Run it on 1,000 people. One is sick and tests positive. Of the 999 healthy people, about 50 also test positive. So 51 positives, one real case: roughly a 2% chance. The test is good. The disease is just rare.",
      "That background frequency is the base rate, and ignoring it is one of the most common errors in reasoning. Before judging how likely something is from a vivid clue, ask how common it is to begin with. Rare things stay unlikely even after fairly strong evidence.",
    ], "Start from how common something is, then adjust for the evidence. A positive result for a rare condition is usually a false alarm.", [
      Q("A disease affects 1 in 1,000. A test has a 5% false-positive rate and misses no cases. You test positive. Roughly how likely is it you're ill?", "About 2%", ["About 95%", "About 50%", "About 20%"], "Out of 1,000 people: 1 true positive and about 50 false ones."),
      Q("What is a base rate?", "How common something is in general", ["The accuracy of a test", "The lowest possible probability", "An average of two rates"], "It is the starting frequency before you see specific evidence."),
      Q("Why do most positive results for a very rare condition turn out to be wrong?", "Healthy people vastly outnumber sick ones, so their false positives dominate", ["The tests are badly made", "Doctors misread them", "Rare diseases can't be tested for"], "Even a small error rate applied to a huge healthy group swamps the few real cases."),
    ]),
    L("num-2", "Correlation is not causation", [
      "Ice-cream sales and drownings rise and fall together. Ice cream does not cause drowning. Hot weather drives both. When two things move together they are correlated, and that alone doesn't tell you one causes the other.",
      "There are three usual suspects. A hidden third factor, called a confounder, may drive both. The cause may run backwards: people who are ill exercise less, so “non-exercisers are sicker” may not mean what it seems. Or it's coincidence, which is easy to find if you search enough data.",
      "The gold standard for showing cause is a randomised controlled trial. Assign people to two groups by chance, give only one the treatment, and compare. Because chance decided the groups, confounders are balanced between them, and any difference can be credited to the treatment.",
    ], "Two things moving together might share a hidden cause, run the other way, or be chance. Random assignment is what separates cause from correlation.", [
      Q("Ice-cream sales and drownings are correlated. What best explains it?", "Hot weather increases both", ["Ice cream causes cramps", "Drownings make people buy ice cream", "Nothing; it must be an error"], "Heat is a confounder: a third factor driving both."),
      Q("What is a confounder?", "A hidden factor that influences both things being compared", ["A mistake in arithmetic", "A very small sample", "A person who drops out of a study"], "It creates a link between two things that don't affect each other."),
      Q("Why does randomly assigning people to groups help prove causation?", "It balances other factors across the groups", ["It makes the study bigger", "It hides the results from researchers", "It removes the need for a comparison group"], "With chance deciding who gets treated, the groups differ only in the treatment."),
    ]),
    L("num-3", "Expected value", [
      "Expected value is the average result you'd get if you could repeat a gamble many times. Multiply each outcome by its probability and add them up. A bet that pays $100 one time in ten is worth $10 on average.",
      "A typical lottery ticket costs $2 and has an expected payout of around $1. Play once and anything can happen. Play a thousand times and you will reliably lose about half your money. Casinos and insurers live on this: each bet is uncertain, the total is close to guaranteed.",
      "Insurance has negative expected value for the buyer, and it's still sensible. You pay a small certain cost to avoid a loss you couldn't survive. The rule: for small, repeated bets, follow expected value. For anything that could ruin you, protect the downside first.",
    ], "Probability times payoff, summed, tells you what a choice is worth on average. Follow it for repeated small bets; never risk ruin.", [
      Q("A game pays $60 with probability 1/6 and nothing otherwise. What is its expected value?", "$10", ["$60", "$6", "$36"], "$60 × 1/6 = $10."),
      Q("Why do casinos make money reliably even though each bet is uncertain?", "Over many bets, results converge on the expected value", ["They decide who wins", "Players tip the staff", "Most games are impossible to win"], "A small edge repeated thousands of times becomes a near-certain profit."),
      Q("Insurance has negative expected value for the buyer. Why can it still be a good decision?", "It protects against a loss you couldn't absorb", ["Insurers usually lose money", "Premiums are refunded", "Expected value doesn't apply to money"], "Avoiding ruin matters more than the average outcome."),
    ]),
    L("num-4", "Regression to the mean", [
      "An athlete has a spectacular season, appears on a magazine cover, and does worse the next year. Fans call it a jinx. It's arithmetic. Extreme results are usually part skill and part luck, and the luck doesn't repeat.",
      "This is regression to the mean: after an unusually high or low measurement, the next one tends to be closer to average. It happens whenever chance plays any part, which is almost always.",
      "It fools people constantly. A flight instructor noticed that cadets praised for a great landing did worse next time, while those shouted at for a bad one improved, and concluded that shouting works. Neither did anything. Likewise people seek treatment when symptoms are at their worst, so they tend to improve whatever they take. This is why trials need a comparison group.",
    ], "Extreme results are partly luck, so what follows is usually more ordinary. Don't credit or blame whatever happened in between.", [
      Q("A student scores far above their usual level on one test. What is most likely on the next?", "A score closer to their average", ["An even higher score", "A failing score", "Exactly the same score"], "The lucky part of an extreme result tends not to repeat."),
      Q("Why did punishing bad landings seem to work for the flight instructor?", "Unusually bad landings were likely to be followed by better ones anyway", ["Fear improves flying", "The cadets practised more", "Praise made cadets lazy"], "Performance drifted back toward average regardless of what he said."),
      Q("Why does regression to the mean make a comparison group essential in medical trials?", "People enrol at their worst and would improve somewhat regardless", ["Patients forget their symptoms", "Drugs take years to work", "Doctors treat groups differently"], "Without a comparison you'd credit the treatment for natural improvement."),
    ]),
  ],
};

export const space = {
  id: "space", title: "Space and physics", tag: "Science", icon: "🚀", color: "#6366f1",
  blurb: "Orbits, light, the Big Bang and the lives of stars, in plain language.",
  lessons: [
    L("spa-1", "Why things orbit", [
      "Astronauts on the space station float, but not because gravity is absent. At that height it is still about 90% as strong as on the ground. They float because they are falling, continuously, along with their spacecraft.",
      "Newton pictured a cannon on a mountaintop. Fire the ball gently and it lands nearby. Fire it faster and it lands farther off. Fire it fast enough, about 28,000 km/h near Earth, and the ground curves away beneath it as fast as it falls. It never lands. That is an orbit: falling around something.",
      "The same rule runs everything from the Moon to galaxies. Gravity pulls between any two masses and weakens with the square of the distance: twice as far, a quarter of the pull. Closer orbits must be faster. The station circles Earth in about 90 minutes; the Moon takes about 27 days.",
    ], "An orbit is a fall that keeps missing the ground. Gravity fades with the square of distance, so closer objects must orbit faster.", [
      Q("Why do astronauts float on the space station?", "They and the station are in continuous free fall", ["There is no gravity in space", "The station spins", "They are beyond Earth's pull"], "Gravity there is nearly as strong as on the surface. Orbiting is falling."),
      Q("If you double the distance between two objects, the gravitational pull becomes…", "one quarter as strong", ["half as strong", "twice as strong", "unchanged"], "Gravity follows an inverse-square law."),
      Q("Compared with the Moon, a satellite in low orbit travels…", "much faster", ["much slower", "at the same speed", "in the opposite direction"], "Closer orbits need more speed: 90 minutes a lap versus about 27 days."),
    ]),
    L("spa-2", "The speed of light and time", [
      "Light travels at about 300,000 kilometres per second. Sunlight takes roughly eight minutes to reach us, so you see the Sun as it was eight minutes ago. A light-year is the distance light covers in a year: about 9.5 trillion kilometres.",
      "In 1905 Einstein started from a strange fact: everyone measures the same speed of light, however fast they themselves are moving. For that to hold, something else has to give. What gives is time and distance.",
      "A clock moving fast relative to you ticks more slowly than yours. This is time dilation, and it is measured every day. GPS satellites move at about 14,000 km/h and also sit in weaker gravity, both of which shift their clocks. Without correcting for relativity, GPS positions would drift by kilometres a day. Nothing with mass can reach light speed.",
    ], "The speed of light is the same for everyone, so time and distance must stretch instead. Moving clocks run slow, and GPS has to correct for it.", [
      Q("About how long does sunlight take to reach Earth?", "8 minutes", ["8 seconds", "8 hours", "It is instant"], "At 300,000 km/s, the 150 million km trip takes about eight minutes."),
      Q("What is a light-year?", "The distance light travels in a year", ["The time light takes to cross the Sun", "365 days measured in space", "A unit of brightness"], "It is a distance: about 9.5 trillion kilometres."),
      Q("What is time dilation?", "A moving clock ticks more slowly than one at rest relative to you", ["Clocks stop in space", "Time runs backwards near light speed", "Days getting longer as Earth slows"], "It is small at everyday speeds but real, and GPS must correct for it."),
    ]),
    L("spa-3", "The Big Bang", [
      "In the 1920s Edwin Hubble found that distant galaxies are moving away from us, and the farther away they are, the faster they recede. The best explanation is that space itself is expanding, like dots on a balloon moving apart as it inflates.",
      "Run that backwards and everything was once packed together, hot and dense. The Big Bang is the name for that early state and the expansion from it, about 13.8 billion years ago. It was not an explosion into empty space. It was the expansion of space itself, everywhere at once.",
      "The strongest evidence is a faint glow of microwaves coming from every direction, found by accident in 1965. This cosmic microwave background is light released when the universe was about 380,000 years old and had cooled enough to become transparent. It is the oldest light we can see.",
    ], "Galaxies are receding because space is expanding. Rewind it and you get a hot, dense beginning 13.8 billion years ago, whose afterglow we can still detect.", [
      Q("What did Hubble discover about distant galaxies?", "The farther away they are, the faster they recede", ["They are all the same age", "They orbit the Milky Way", "They are moving toward us"], "That pattern is what you'd see if space itself were expanding."),
      Q("Roughly how old is the universe?", "13.8 billion years", ["4.5 billion years", "13.8 million years", "100 billion years"], "4.5 billion is the age of the Earth and Sun."),
      Q("What is the cosmic microwave background?", "Light left over from when the early universe became transparent", ["Radio noise from the Sun", "Heat from the Milky Way's centre", "Reflected starlight"], "It dates from about 380,000 years after the Big Bang."),
    ]),
    L("spa-4", "The lives of stars", [
      "A star is a balance. Gravity pulls its gas inward. In the core, pressure and heat are so extreme that hydrogen nuclei fuse into helium, releasing energy that pushes outward. The Sun has held that balance for about 4.6 billion years and has roughly 5 billion to go.",
      "When the core's hydrogen runs out, a star like the Sun swells into a red giant, sheds its outer layers and leaves a dense, Earth-sized ember called a white dwarf. Bigger stars burn hotter and die sooner, in millions of years, not billions.",
      "A star more than about eight times the Sun's mass ends in a supernova, an explosion that can briefly outshine a galaxy. What's left is a neutron star or, for the heaviest, a black hole. Those explosions matter to you: the carbon, oxygen and iron in your body were forged inside stars and scattered when they died.",
    ], "Stars shine by fusing hydrogen while gravity and pressure balance. How they die depends on mass, and their deaths made the elements we're built from.", [
      Q("What powers a star like the Sun?", "Fusion of hydrogen into helium in its core", ["Burning gas with oxygen", "Radioactive decay", "Friction from spinning"], "Fusion releases the energy that holds the star up against gravity."),
      Q("What will the Sun eventually become?", "A red giant, then a white dwarf", ["A black hole", "A supernova", "A neutron star"], "It isn't massive enough to explode."),
      Q("Where did the carbon and iron in your body come from?", "They were made inside earlier stars", ["They formed in the Big Bang", "They were made in Earth's core", "They came from the Sun"], "Heavy elements are forged in stars and spread when they die."),
    ]),
  ],
};
