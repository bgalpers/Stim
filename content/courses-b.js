// Economics + Psychology.

export const economics = {
  id: "economics", title: "How economies work", tag: "Economics",
  blurb: "Prices, trade-offs, inflation, central banks, GDP and trade: the working parts behind the headlines.",
  lessons: [
    {
      id: "eco-1", title: "Supply, demand and what prices do",
      body: [
        "A price is a piece of information. It tells buyers how much of something is available and tells sellers how badly people want it, without anyone having to coordinate the two.",
        "Demand describes buyers: as the price of something falls, people generally want more of it. Supply describes sellers: as the price rises, producers are willing to make more. Plot both and they cross at one price where the amount people want to buy equals the amount offered for sale. Economists call that the equilibrium.",
        "Markets push toward it. If the price sits above equilibrium, sellers are left with unsold stock, a surplus, and cut prices to clear it. If the price sits below, there is a shortage: queues, empty shelves, bidding wars. Sellers notice and raise prices.",
        "Change the conditions and the price moves. A frost that destroys part of the coffee crop shifts supply inward: less coffee at every price, so the price rises and people drink a little less or switch to tea. A new study praising coffee shifts demand outward: price and quantity both rise. No committee is required. The higher price itself rations the scarce beans and pays farmers elsewhere to plant more.",
        "This is why price controls have predictable side effects. A cap held below the market price, such as strict rent control, makes more people want the good while giving suppliers less reason to provide it, so shortages follow. A floor held above the market price produces surpluses. Controls can still be worth it for other reasons, but the trade-off is real.",
      ],
      takeaway: "Prices coordinate buyers and sellers. Hold a price away from where supply meets demand and you get a shortage or a surplus.",
      quiz: [
        { q: "The price of a good is held below its market equilibrium. What is the likely result?", o: ["A surplus", "A shortage", "No change", "Lower demand"], a: 1, why: "At an artificially low price, more is wanted than suppliers will offer." },
        { q: "A frost destroys much of the coffee harvest. What happens in the coffee market?", o: ["Price falls, quantity rises", "Price and quantity both fall", "Price rises, quantity sold falls", "Nothing changes"], a: 2, why: "Supply shrinks, so the price rises and people buy less." },
        { q: "What is the equilibrium price?", o: ["The price where the quantity demanded equals the quantity supplied", "The lowest price sellers will accept", "The price set by government", "The average price over a year"], a: 0, why: "It is where the supply and demand curves cross and the market clears." },
      ],
    },
    {
      id: "eco-2", title: "Opportunity cost and thinking at the margin",
      body: [
        "The true cost of anything is what you give up to get it. Economists call this the opportunity cost: the value of the best alternative you did not choose.",
        "A free concert ticket is not free if using it means missing a shift that would have paid $120. A year of graduate school costs the tuition plus the salary you would have earned. Thinking this way exposes hidden costs. Money sitting in a zero-interest account costs you whatever it could have earned elsewhere. An hour spent scrolling costs whatever else that hour could have been.",
        "The second habit is thinking at the margin. Few choices are all-or-nothing. The useful question is usually whether one more unit is worth it: one more hour of study, one more employee, one more slice. The extra benefit from one more unit is the marginal benefit, and the extra cost is the marginal cost. Keep going as long as the first exceeds the second, and stop when they meet.",
        "Marginal benefit usually falls as you get more of something. The first slice of pizza is wonderful. The fifth is a chore. That is why a sensible person stops well before the box is empty, and why a firm stops hiring before the next worker adds less than they cost.",
        "Marginal thinking also tells you what to ignore. Money or effort already spent and impossible to recover is a sunk cost. It should not affect what you do next. If a film is terrible after thirty minutes, the ticket price is gone either way. The only real question is whether the next ninety minutes are better spent there or somewhere else. People find this hard, and carrying on because of what is already spent is called the sunk cost fallacy.",
      ],
      takeaway: "Cost means the best thing you gave up. Decide by comparing the next unit's benefit with its cost, and ignore what is already spent.",
      quiz: [
        { q: "What is the opportunity cost of a choice?", o: ["Its price in dollars", "The value of the best alternative given up", "The tax on it", "The total of all alternatives"], a: 1, why: "It is the single best option you passed up, whether or not money changed hands." },
        { q: "You paid $15 for a film that turns out to be awful. Rationally, should the $15 affect whether you stay?", o: ["Yes, to get your money's worth", "Yes, if it was expensive", "Only if you paid cash", "No, it is a sunk cost"], a: 3, why: "The money is gone either way. Only the value of your remaining time matters." },
        { q: "According to marginal thinking, when should you stop doing more of something?", o: ["When marginal cost reaches marginal benefit", "When total benefit is zero", "When you run out of money", "Never"], a: 0, why: "Each extra unit is worth it only while its added benefit exceeds its added cost." },
      ],
    },
    {
      id: "eco-3", title: "Inflation",
      body: [
        "Inflation is a sustained rise in the general level of prices. It is not one thing getting dearer. It is money buying less across the board. At 3% inflation, a basket of goods that cost $100 last year costs $103 now.",
        "It is usually measured with a consumer price index. Statisticians track the price of a fixed basket of things households buy, such as rent, food, fuel and haircuts, and report how much the total has changed.",
        "Economists group the causes into two kinds. Demand-pull inflation happens when spending outruns what the economy can produce: too much money chasing too few goods. Cost-push inflation comes from the supply side, when something raises the cost of producing, such as an oil shock or broken supply chains. Expectations matter too. If workers and firms expect prices to rise 5%, they demand raises and set prices accordingly, which helps make it happen.",
        "Moderate, steady inflation does little harm, and most central banks aim for about 2% a year. Unexpected inflation creates winners and losers. It hurts savers and people on fixed incomes, whose money buys less, and helps borrowers, who repay in cheaper dollars. That is why what matters is the real interest rate: the stated rate minus inflation. A savings account paying 4% with inflation at 5% is losing 1% of its buying power a year.",
        "Very high inflation is destructive, because people stop trusting money at all. Falling prices, called deflation, are dangerous for a different reason: if things will be cheaper next year, people delay buying, firms cut back, and debts become heavier in real terms.",
      ],
      takeaway: "Inflation is money losing buying power. Judge any return or wage rise in real terms: the headline rate minus inflation.",
      quiz: [
        { q: "Your savings account pays 4% and inflation is 5%. What is your real return?", o: ["9%", "4%", "1%", "−1%"], a: 3, why: "4% − 5% = −1%. Your balance grows, but it buys less." },
        { q: "Who generally benefits from unexpectedly high inflation?", o: ["Borrowers with fixed-rate debt", "People on fixed pensions", "Savers holding cash", "Lenders"], a: 0, why: "Borrowers repay with money that is worth less than when they borrowed it." },
        { q: "An oil price shock pushes up the cost of producing almost everything. This is an example of…", o: ["Deflation", "Cost-push inflation", "Demand-pull inflation", "A real interest rate"], a: 1, why: "The pressure comes from higher production costs rather than from extra spending." },
      ],
    },
    {
      id: "eco-4", title: "What central banks do",
      body: [
        "A central bank, such as the Federal Reserve in the United States or the European Central Bank, manages a country's money and credit. Its main job is to keep inflation low and stable. The Fed has a dual mandate from Congress: stable prices and maximum employment.",
        "Its chief tool is a short-term interest rate. In the US this is the federal funds rate, the rate at which banks lend to each other overnight. The Fed sets a target for it, and that rate ripples outward into mortgages, car loans, business credit and savings accounts.",
        "The logic runs like this. If inflation is too high, the bank raises rates. Borrowing becomes more expensive, so households and firms spend and invest less. Demand cools and price rises slow. The cost is slower growth and often higher unemployment. If the economy is weak, the bank cuts rates to make borrowing cheap and encourage spending.",
        "The effects are slow and uncertain. A rate change can take a year or more to work through fully, so central bankers have to act on forecasts, a bit like steering a ship that responds minutes after you turn the wheel.",
        "When rates are already near zero, as after the 2008 financial crisis, central banks have used quantitative easing: creating money to buy government bonds and other assets, which pushes down longer-term interest rates. They also act as lender of last resort, lending to sound banks during a panic so that a run on one does not bring down the system.",
        "Most central banks are run independently of elected politicians. The reason is temptation: a government facing an election would always prefer low rates and a boom now, leaving the inflation for later.",
      ],
      takeaway: "Central banks raise interest rates to cool inflation and cut them to support a weak economy. The effects arrive slowly, which makes the job hard.",
      quiz: [
        { q: "Inflation is running well above target. What does a central bank typically do?", o: ["Cut interest rates", "Print more money", "Raise interest rates", "Lower taxes"], a: 2, why: "Higher rates make borrowing dearer, which cools spending and slows price rises." },
        { q: "What are the two parts of the Federal Reserve's dual mandate?", o: ["Stable prices and maximum employment", "Low taxes and a strong dollar", "Balanced budgets and free trade", "High growth and rising stock prices"], a: 0, why: "Congress charges the Fed with both price stability and maximum employment." },
        { q: "Why are most central banks independent of elected governments?", o: ["Politicians cannot understand interest rates", "It is required by international law", "Central banks are private companies", "Politicians would be tempted to keep rates too low before elections"], a: 3, why: "Independence guards against trading long-term inflation for a short-term boom." },
      ],
    },
    {
      id: "eco-5", title: "GDP and what it misses",
      body: [
        "Gross domestic product is the market value of all final goods and services produced within a country in a given period. It is the standard measure of the size of an economy.",
        "The word “final” matters. The flour sold to a baker is not counted separately, because its value is already inside the price of the bread. Counting both would double-count.",
        "One common way to add GDP up is by spending: consumption by households, plus investment by businesses, plus government purchases, plus exports minus imports. In the United States, household consumption is about two thirds of the total.",
        "Two adjustments make the number useful. Real GDP strips out inflation, so that growth reflects more stuff produced rather than higher prices. GDP per person divides by population, which is a better guide to living standards. India's economy is larger than Switzerland's, but the average Swiss resident is far richer. A recession is, loosely, a significant and sustained fall in real GDP.",
        "GDP is a measure of market production, not of well-being, and it leaves a great deal out. Unpaid work such as caring for children or parents is not counted. Leisure is not counted. Nor is how income is shared: GDP per person can rise while most people stand still. Pollution is not subtracted, and cleaning it up afterwards adds to GDP. An earthquake can raise it, because rebuilding counts and the destroyed wealth does not.",
        "Simon Kuznets, who designed the US national accounts in the 1930s, warned that a nation's welfare could scarcely be inferred from them. GDP remains indispensable for tracking the economy. It is simply not a scorecard for a good life.",
      ],
      takeaway: "GDP measures the value of what an economy produces for sale. Use real, per-person figures for comparisons, and remember what it does not count.",
      quiz: [
        { q: "Why is the flour a baker buys not counted separately in GDP?", o: ["Flour is imported", "Its value is already included in the final bread", "Only services count", "Bakers are exempt"], a: 1, why: "GDP counts final goods only, to avoid counting the same value twice." },
        { q: "What does real GDP adjust for?", o: ["Population", "Exchange rates", "Inflation", "Unpaid work"], a: 2, why: "Real GDP removes price changes so growth reflects actual output." },
        { q: "Which of these is NOT included in GDP?", o: ["A parent caring for their own child at home", "A haircut at a salon", "A new car bought by a family", "Government spending on roads"], a: 0, why: "Unpaid household work has no market price, so GDP leaves it out." },
      ],
    },
    {
      id: "eco-6", title: "Comparative advantage and trade",
      body: [
        "Why do countries trade, even when one of them could make everything more efficiently itself? The answer, worked out by David Ricardo in 1817, is one of the least intuitive and most important ideas in economics.",
        "Start with a person. Suppose a surgeon is also the fastest typist in the hospital. She has an absolute advantage in both surgery and typing. Should she type her own notes? No. An hour of her typing costs an hour of surgery, which is worth far more. Her assistant gives up very little to type. The assistant has the comparative advantage in typing: the lower opportunity cost.",
        "Countries work the same way. Imagine Country A can make either 10 cars or 20 tonnes of wheat with a set of workers, and Country B can make either 2 cars or 10 tonnes of wheat. A is better at both. But each car costs A two tonnes of wheat, while it costs B five. A should lean toward cars, B toward wheat, and they should trade. Total output of both goods rises, and both can end up with more than they could make alone.",
        "The principle is that everyone gains by specialising in what they give up least to produce. Being worse at everything does not shut a country out of trade. It only determines what it should specialise in.",
        "The gains are real but not evenly spread. Trade makes a country richer overall while concentrating losses on particular workers and towns whose industries face imports. Economists generally argue that the answer is to compensate and retrain those who lose rather than block trade, though in practice that help has often fallen short, which is a large part of why trade remains politically contested.",
      ],
      takeaway: "Trade pays when each side specialises in what costs it least to produce, measured in what it gives up. Overall gains do not mean everyone gains.",
      quiz: [
        { q: "What does comparative advantage depend on?", o: ["Who produces the most in total", "Who has the largest population", "Who has the most natural resources", "Who has the lowest opportunity cost"], a: 3, why: "It is about what you give up to produce something, not raw productivity." },
        { q: "A surgeon types faster than her assistant. Why should the assistant still do the typing?", o: ["The assistant gives up less valuable work to type", "Surgeons are not allowed to type", "The assistant is paid more", "Typing is harder than surgery"], a: 0, why: "An hour of the surgeon's typing costs an hour of surgery. The assistant's opportunity cost is far lower." },
        { q: "Country A is more efficient than Country B at making everything. Can both still gain from trade?", o: ["No, only B gains", "Yes, if each specialises where its opportunity cost is lowest", "No, A should make everything itself", "Only if they share a currency"], a: 1, why: "This is Ricardo's insight: absolute advantage in everything does not remove the gains from specialising." },
      ],
    },
  ],
};

export const psychology = {
  id: "psychology", title: "Habits, attention and choice", tag: "Psychology",
  blurb: "How habits form, why feeds are hard to put down, and the predictable ways judgement goes wrong.",
  lessons: [
    {
      id: "psy-1", title: "The habit loop",
      body: [
        "A large share of what you do each day is not decided. Studies in which people logged their actions hour by hour found that roughly 40% of them were repeated in the same context almost daily, usually while thinking about something else. That is habit, and it is the brain saving effort.",
        "A habit has three parts. A cue triggers it: a time, a place, a feeling, a preceding action. A routine follows: the behaviour itself. Then comes a reward, which tells the brain the sequence is worth keeping. Repeat the loop enough and the cue alone starts the routine without a conscious decision. Brain imaging shows the activity shifting from regions used in deliberate choice toward the basal ganglia, which run automatic sequences.",
        "This explains two things about changing behaviour. First, willpower is a weak tool, because a habit fires before deliberation begins. It is far more effective to change the cue. People who move house or start a new job find habits unusually easy to change, because the old triggers are gone. Putting the phone in another room removes the cue. Deciding not to look at it does not.",
        "Second, habits are easier to replace than to erase. Keep the cue and the reward, and insert a different routine. If boredom is the cue and stimulation is the reward, something else has to supply the stimulation.",
        "How long does a new habit take? The popular answer of 21 days has no good evidence behind it. In one well-known study, people adopting a simple daily behaviour took a median of 66 days to make it automatic, with a range from 18 to 254. Missing a single day made no measurable difference. Consistency in the same context is what matters.",
      ],
      takeaway: "Habits run cue, routine, reward. To change one, change the cue or swap the routine. Relying on willpower in the moment mostly fails.",
      quiz: [
        { q: "What are the three parts of the habit loop?", o: ["Goal, plan, action", "Cue, routine, reward", "Trigger, thought, feeling", "Want, need, do"], a: 1, why: "A cue triggers a routine, and a reward reinforces the link." },
        { q: "Why do people often find habits easier to change after moving house?", o: ["They have more free time", "They are more motivated", "Moving reduces stress", "The old cues that triggered the habits are gone"], a: 3, why: "Habits are tied to context. Remove the trigger and the routine does not fire." },
        { q: "In the best-known study, about how long did a new daily behaviour take to become automatic?", o: ["A median of 66 days, with wide variation", "Exactly 21 days", "3 days", "One year"], a: 0, why: "The median was 66 days, ranging from 18 to 254 depending on the person and the behaviour." },
      ],
    },
    {
      id: "psy-2", title: "Variable rewards: why feeds are hard to put down",
      body: [
        "In the 1950s the psychologist B. F. Skinner studied how rewards shape behaviour, using pigeons that pecked a key for food. He found that the schedule of reward mattered as much as the reward. If food arrived after every peck, the birds pecked steadily and stopped soon after the food stopped. If food arrived unpredictably, after a varying number of pecks, they pecked faster, for longer, and kept going long after the rewards ended.",
        "This variable-ratio schedule produces the most persistent behaviour of any that has been studied. It is how a slot machine works: most pulls pay nothing, a few pay a little, and you never know which is next.",
        "The mechanism involves dopamine, a chemical messenger often described as the brain's pleasure signal. It is better understood as a signal of anticipation and of surprise. Dopamine neurons fire most strongly when a reward is better than expected, and in response to cues that predict a possible reward. A reward that is fully predictable produces little response. Uncertainty keeps the system engaged.",
        "A social media feed has the same structure. Each pull to refresh or swipe to the next video is a pull of the lever. Most items are forgettable. Occasionally one is funny, flattering or enraging. Notifications are cues that predict a possible social reward. Infinite scroll removes the natural stopping points, like the end of a page, that would otherwise prompt you to decide whether to continue.",
        "None of this means you are weak. It means the product is well matched to a learning system every human has. The useful response is structural: remove cues by turning off notifications, add friction before the first swipe, and build in stopping points that the design left out.",
      ],
      takeaway: "Unpredictable rewards produce the most persistent behaviour. Feeds are built that way, so the fix is friction and stopping points, not self-criticism.",
      quiz: [
        { q: "Which reward schedule did Skinner find produces the most persistent behaviour?", o: ["A reward every time", "A reward at fixed time intervals", "Unpredictable rewards after a varying number of responses", "No reward at all"], a: 2, why: "Variable-ratio schedules keep behaviour going longest. Slot machines use them." },
        { q: "Dopamine neurons respond most strongly to…", o: ["rewards that are better than expected", "rewards that are completely predictable", "physical pain", "sleep"], a: 0, why: "Dopamine tracks surprise and anticipation more than pleasure itself." },
        { q: "What does infinite scroll remove?", o: ["Advertising", "Natural stopping points", "Variable rewards", "Notifications"], a: 1, why: "Without an end of page there is no built-in moment to decide whether to keep going." },
      ],
    },
    {
      id: "psy-3", title: "Two systems of thinking",
      body: [
        "Try this. A bat and a ball cost $1.10 together. The bat costs $1.00 more than the ball. How much is the ball?",
        "Most people's first answer is 10 cents. It is wrong: the bat would then be $1.10 and the total $1.20. The ball costs 5 cents. More than half of students at elite universities get it wrong, not because they cannot do the arithmetic but because an answer arrived instantly and they did not check it.",
        "Psychologist Daniel Kahneman used examples like this to describe two modes of thought. System 1 is fast, automatic and effortless. It recognises faces, finishes the phrase “bread and…”, and steers a car on an empty road. System 2 is slow, deliberate and effortful. It does long division, compares two phone plans, and parks in a tight space.",
        "System 1 runs constantly and handles most of life well. It does so with shortcuts, called heuristics, which usually work and sometimes mislead in systematic ways. System 2 could catch the errors, but it is lazy. Effortful thought is tiring, so it tends to accept whatever System 1 proposes unless something signals trouble.",
        "Some shortcuts are worth knowing by name. With the availability heuristic, we judge how common something is by how easily examples come to mind, so vivid events like plane crashes feel likelier than they are. With anchoring, an arbitrary number seen first drags later estimates toward it, which is why the first price mentioned in a negotiation matters.",
        "You cannot switch System 1 off. What you can do is learn the situations where it tends to fail, such as high stakes, unfamiliar ground or an answer that came suspiciously easily, and slow down on purpose there.",
      ],
      takeaway: "Fast, intuitive thinking is usually right and occasionally, predictably wrong. Slow down when the stakes are high or the answer came too easily.",
      quiz: [
        { q: "A bat and ball cost $1.10 together, and the bat costs $1.00 more than the ball. What does the ball cost?", o: ["10 cents", "1 cent", "5 cents", "15 cents"], a: 2, why: "Ball 5¢ + bat $1.05 = $1.10. The intuitive 10¢ answer gives a total of $1.20." },
        { q: "Which describes System 2 thinking?", o: ["Fast and automatic", "Slow, deliberate and effortful", "Purely emotional", "Unconscious"], a: 1, why: "System 2 handles deliberate reasoning, and it tires easily." },
        { q: "After a widely reported plane crash, people overestimate the danger of flying. Which shortcut is at work?", o: ["Anchoring", "Sunk cost", "Loss aversion", "The availability heuristic"], a: 3, why: "We judge frequency by how easily examples come to mind, and vivid events come to mind easily." },
      ],
    },
    {
      id: "psy-4", title: "Loss aversion and framing",
      body: [
        "Would you accept a coin flip where heads wins you $150 and tails loses you $100? On average the bet is worth $25 to you. Most people turn it down. To accept, they typically want to win about twice what they might lose.",
        "This is loss aversion, described by Daniel Kahneman and Amos Tversky in 1979 as part of prospect theory. People do not weigh outcomes by their final wealth. They judge gains and losses relative to a reference point, usually where they stand now, and a loss hurts more than an equal gain pleases, in many experiments by roughly two to one.",
        "It shows up everywhere. In the endowment effect, people demand more to give up an object they own than they would have paid to get it. Investors hold falling shares too long to avoid making a loss real, and sell rising ones too soon. People stay with a default option because switching feels like risking a loss.",
        "Loss aversion also makes us sensitive to framing: the same facts described differently. In a classic experiment, people were asked to choose between treatments for a disease threatening 600 lives. When a programme was described as saving 200 people, most chose it. When the identical programme was described as letting 400 people die, most rejected it in favour of a gamble. The numbers were the same. Described as gains, people played safe. Described as losses, they took risks to avoid them.",
        "Marketers know this well. “Don't miss out” works better than “here is an offer”. So does a streak counter that you will lose by skipping a day. The defence is to restate a decision the other way round and see whether your answer survives.",
      ],
      takeaway: "Losses weigh about twice as much as equal gains, so how a choice is framed can flip the decision. Reframe it before you commit.",
      quiz: [
        { q: "What is loss aversion?", o: ["Avoiding all risk", "A loss feeling worse than an equal gain feels good", "Forgetting past losses", "Preferring certain losses"], a: 1, why: "In many experiments a loss weighs roughly twice as much as a gain of the same size." },
        { q: "People demand more money to give up a mug they own than they would pay to buy the same mug. This is called…", o: ["The endowment effect", "Anchoring", "The availability heuristic", "Present bias"], a: 0, why: "Owning something makes giving it up register as a loss." },
        { q: "In the disease experiment, why did choices flip between the two descriptions?", o: ["The numbers were different", "People misread the question", "One version offered more money", "The same outcome was framed as a gain in one and a loss in the other"], a: 3, why: "“200 saved” and “400 die” describe the same result, yet they push people toward caution or toward risk." },
      ],
    },
    {
      id: "psy-5", title: "Present bias and commitment devices",
      body: [
        "Would you rather have $100 today or $110 in a week? Many people take the $100. Now: $100 in 52 weeks or $110 in 53 weeks? Almost everyone waits for the $110. The delay and the extra $10 are identical in both cases. The only difference is that in the first, one option is available now.",
        "This is present bias. We do not discount the future at a steady rate. We give special, outsized weight to right now, and treat everything later as roughly “later”. Economists call the pattern hyperbolic discounting.",
        "It creates a conflict between two versions of you. Your planning self sincerely intends to exercise tomorrow, save next month and start the essay on Monday. When tomorrow arrives it has become now, and the immediate cost looms large again. The plans were not dishonest. Your preferences actually reversed.",
        "Knowing this, the planning self can act in advance. A commitment device is a choice made now that restricts or raises the price of options later. The classic image is Ulysses having himself tied to the mast so he could hear the Sirens without steering onto the rocks.",
        "Modern versions are everywhere. Automatic transfers into savings on payday remove the monthly decision. One study offered bank customers an account they could not withdraw from until they hit a goal: those offered it saved substantially more. Betting money that you will go to the gym, deleting an app, or locking it behind a task, all work the same way.",
        "The other lever runs in reverse: make the good thing rewarding now. Saving a favourite podcast for workouts ties an immediate pleasure to a delayed benefit. Either way, the principle is to stop relying on your future self to feel differently than you do today.",
      ],
      takeaway: "We overweight right now, so plans made for later often collapse when later arrives. Bind your future self in advance instead of trusting it.",
      quiz: [
        { q: "What is present bias?", o: ["Remembering only recent events", "Giving outsized weight to immediate rewards over later ones", "Preferring gifts to money", "Fear of the future"], a: 1, why: "“Now” gets special weight, so preferences reverse as a future moment becomes the present." },
        { q: "Which of these is a commitment device?", o: ["Promising yourself you'll try harder", "Checking your bank balance", "Setting up an automatic transfer to savings on payday", "Reading about saving"], a: 2, why: "It is a decision made in advance that removes the later temptation." },
        { q: "Most people choose $100 today over $110 next week, but $110 in 53 weeks over $100 in 52 weeks. What does this show?", o: ["Preferences change when one option is immediate", "People cannot do arithmetic", "$10 is not worth a week", "People distrust banks"], a: 0, why: "The trade-off is identical. Only the presence of “now” changes the answer." },
      ],
    },
    {
      id: "psy-6", title: "Attention and the cost of switching",
      body: [
        "People talk about multitasking as though attention could be split. For tasks that need thought, it mostly cannot. What feels like doing two things at once is rapid switching between them, and each switch has a price.",
        "Laboratory studies of task switching are consistent: when people alternate between two tasks they are slower and make more errors than when they do one and then the other. The brain has to drop one set of rules and load another every time.",
        "The cost lingers after the switch. Researcher Sophie Leroy named the effect attention residue: when you leave a task unfinished and turn to another, part of your mind stays on the first, and you do the second one worse. A “quick check” of messages therefore costs more than the thirty seconds it takes.",
        "Interruptions are similar. Observational studies of office workers by Gloria Mark found that after an interruption people took, on average, more than twenty minutes to return to the original task, usually visiting other tasks on the way.",
        "The phone does not even have to be used. In one widely cited experiment, people did worse on demanding thinking tests when their phone sat on the desk, face down and silent, than when it was in another room. Later attempts to repeat the result have been mixed, so treat the size of the effect with caution, but the direction fits everything else: resisting a temptation uses attention too.",
        "The practical conclusions are unglamorous. Do demanding work in uninterrupted blocks. Batch messages into set times. Finish, or at least write down the next step, before switching. And put the thing that distracts you somewhere it takes effort to reach.",
      ],
      takeaway: "Multitasking is switching, and switching leaves a residue. Protect uninterrupted blocks and keep distractions physically out of reach.",
      quiz: [
        { q: "What actually happens when people “multitask” on demanding tasks?", o: ["Attention splits evenly", "Both tasks speed up", "They switch rapidly between tasks, with a cost each time", "The brain uses both halves separately"], a: 2, why: "Each switch means dropping one set of rules and loading another, which costs time and accuracy." },
        { q: "What is “attention residue”?", o: ["Part of your attention staying on the previous task after you switch", "Tiredness after a long day", "Forgetting what you were doing", "Eye strain from screens"], a: 0, why: "Leaving a task unfinished keeps part of your mind on it, so the next task suffers." },
        { q: "Which habit best protects attention, according to the lesson?", o: ["Checking messages as they arrive", "Keeping the phone face down on the desk", "Switching tasks every few minutes", "Working in uninterrupted blocks with distractions out of reach"], a: 3, why: "Fewer switches and more distance from the distraction both reduce the cost." },
      ],
    },
  ],
};
