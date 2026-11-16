// US civics · Ancient world · Communication
import { L, Q } from "./make.js";

export const civics = {
  id: "civics", title: "How the US government works", tag: "Civics", icon: "🗽", color: "#2563eb",
  blurb: "Branches, bills, rights and elections: the rules of the system, without the shouting.",
  lessons: [
    L("civ-1", "Three branches, each checking the others", [
      "The Constitution, written in 1787, splits federal power three ways. Congress, the legislative branch, makes laws. The president leads the executive branch, which carries them out. The courts, the judicial branch, interpret them. The framers had just fought a king and designed the system to stop any one group gaining too much power.",
      "Each branch can block the others. The president can veto a bill, and Congress can override that veto with a two-thirds vote in both chambers. The Senate must confirm judges and senior officials. Congress controls spending and can impeach and remove a president.",
      "The courts' main check is judicial review: the power to strike down a law or action that violates the Constitution. It isn't spelled out in the text. The Supreme Court claimed it in Marbury v. Madison in 1803, and it has stood ever since.",
    ], "Power is divided between Congress, the president and the courts, and each holds tools to stop the others. That friction is deliberate.", [
      Q("Which branch of government makes federal laws?", "The legislative branch (Congress)", ["The executive branch", "The judicial branch", "The Cabinet"], "Congress writes laws, the executive carries them out, the courts interpret them."),
      Q("How can Congress override a presidential veto?", "A two-thirds vote in both chambers", ["A simple majority in the House", "A Supreme Court ruling", "A national referendum"], "It is a deliberately high bar."),
      Q("What is judicial review?", "The courts' power to strike down laws that violate the Constitution", ["Congress reviewing judges' pay", "The president reviewing court rulings", "A yearly audit of the courts"], "Established by Marbury v. Madison in 1803."),
    ]),
    L("civ-2", "How a bill becomes law", [
      "Congress has two chambers. The House of Representatives has 435 members, divided among the states by population and elected every two years. The Senate has 100, two per state whatever its size, serving six-year terms. A bill must pass both in identical form.",
      "Most bills die quietly. A bill is first sent to a committee, which can amend it, vote it forward or simply never take it up. In the Senate, most bills also need 60 votes to end debate, because of a rule called the filibuster, so a minority of 41 can block them.",
      "If the two chambers pass different versions, they must agree one text. Then it goes to the president, who can sign it into law or veto it. Thousands of bills are introduced in each two-year Congress. Only a small percentage become law.",
    ], "A bill must clear committees, pass both chambers in the same form, usually find 60 Senate votes, and get the president's signature. Most don't.", [
      Q("How are seats in the House of Representatives divided among the states?", "By population", ["Two per state", "By land area", "By tax revenue"], "The Senate is the chamber with two per state."),
      Q("What does the Senate filibuster do in practice?", "Means most bills need 60 votes to move forward", ["Lets the president delay a vote", "Limits senators to one speech", "Requires unanimous approval"], "Ending debate takes 60 of 100 senators."),
      Q("Where do most bills fail?", "In committee, before any full vote", ["At the president's desk", "In the Supreme Court", "In state legislatures"], "Committees decide which bills advance, and most never do."),
    ]),
    L("civ-3", "The Bill of Rights", [
      "When the Constitution was sent to the states for approval, critics objected that it listed the government's powers and none of the people's protections. The first ten amendments, ratified in 1791, were the answer. Together they are the Bill of Rights.",
      "The First Amendment protects five freedoms: religion, speech, the press, peaceful assembly and petitioning the government. The Fourth bars unreasonable searches and seizures, which is why police generally need a warrant. The Fifth and Sixth cover the accused: no forced self-incrimination, due process of law, a lawyer and a speedy public trial by jury.",
      "These rights restrain government, not private parties. The First Amendment stops Congress punishing your speech; it doesn't stop a company moderating its platform. Originally they bound only the federal government. After the Fourteenth Amendment in 1868, courts gradually applied most of them to the states as well.",
    ], "The first ten amendments limit what government may do to individuals. They restrict the state, not private companies or people.", [
      Q("Which amendment protects freedom of speech, religion and the press?", "The First", ["The Second", "The Fourth", "The Tenth"], "It also covers peaceful assembly and petition."),
      Q("What does the Fourth Amendment protect against?", "Unreasonable searches and seizures", ["Cruel punishment", "Being tried twice", "Quartering soldiers"], "It is the basis of the warrant requirement."),
      Q("Does the First Amendment stop a private company removing your post from its platform?", "No, it restricts government, not private companies", ["Yes, always", "Only for political posts", "Only in federal buildings"], "The Bill of Rights limits what the state can do."),
    ]),
    L("civ-4", "Federalism and the Electoral College", [
      "The United States is a federal system: power is shared between the national government and the states. The national government handles things like defence, currency and trade between states. States run most of daily life: schools, policing, roads, most criminal law and the conduct of elections.",
      "That structure shapes how presidents are chosen. Voters technically choose electors. Each state has as many electors as it has members of Congress, and Washington DC has three, making 538. A candidate needs a majority: 270.",
      "Nearly every state gives all its electors to whoever wins that state, however narrowly. So campaigns concentrate on a handful of closely divided swing states, and a candidate can win the presidency while losing the national popular vote. That happened in 2000 and 2016. Changing the system would take a constitutional amendment.",
    ], "States hold real power, including over elections. Presidents are chosen by 538 electors awarded state by state, and 270 wins.", [
      Q("How many electoral votes does a candidate need to win the presidency?", "270", ["538", "100", "51"], "A majority of the 538 electors."),
      Q("Why do presidential campaigns focus on a few “swing states”?", "Most states give all their electors to the state winner, so close states decide the result", ["Swing states have the most people", "Other states don't vote", "Federal law requires it"], "A narrow win in a divided state delivers all of its electors."),
      Q("What is federalism?", "Sharing power between national and state governments", ["Rule by a single national government", "Rule by the courts", "A system with no written constitution"], "States keep authority over much of everyday law."),
    ]),
  ],
};

export const ancient = {
  id: "ancient", title: "The ancient world", tag: "History", icon: "🏺", color: "#d97706",
  blurb: "The first cities, Athenian democracy, Rome's rise and the Silk Road that tied it together.",
  lessons: [
    L("anc-1", "The first cities and writing", [
      "For most of human history people lived in small groups that moved with their food. Farming changed that. Beginning around 10,000 BC in the Fertile Crescent, people domesticated wheat, barley, sheep and goats. Farming fed more people on less land and produced a surplus that could be stored.",
      "A surplus meant not everyone had to farm. By about 3500 BC, in Mesopotamia, the land between the Tigris and Euphrates in today's Iraq, the first true cities appeared. Uruk may have held 40,000 people, with priests, craftsmen, soldiers and rulers.",
      "Cities needed records: who owed grain, who owned which field. The earliest known writing, cuneiform, wedge-shaped marks pressed into clay, began as accounting around 3300 BC. Only later was it used for laws, letters and stories such as the Epic of Gilgamesh. History in the strict sense starts here, because for the first time people left records in their own words.",
    ], "Farming created surplus, surplus created cities, and cities needed records. Writing began as bookkeeping.", [
      Q("What was the earliest writing mainly used for?", "Keeping accounts and records", ["Poetry", "Religious prophecy", "Personal letters"], "Cuneiform began as a way to track goods and debts."),
      Q("Where did the first true cities appear?", "Mesopotamia", ["Britain", "Scandinavia", "Japan"], "Between the Tigris and Euphrates, in present-day Iraq."),
      Q("Why did farming make cities possible?", "It produced a surplus, freeing some people for other work", ["It required people to keep moving", "It made tools unnecessary", "It ended trade"], "Stored food supported priests, craftsmen, soldiers and rulers."),
    ]),
    L("anc-2", "Athens and democracy", [
      "Ancient Greece was not one country but hundreds of independent city-states. In 508 BC one of them, Athens, began an experiment. Reforms led by Cleisthenes handed political power to the citizen body. The Greek word was demokratia: rule by the people.",
      "It was a direct democracy. Citizens did not elect representatives to decide for them. They gathered in the Assembly, where any citizen could speak, and voted on laws and war themselves. Most officials were chosen by lottery, on the view that elections favour the rich and famous.",
      "The limits were severe. Only free adult men born to Athenian parents counted as citizens. Women, slaves and foreign residents, the large majority of the population, had no vote. Still, the idea that ordinary citizens could govern themselves, and argue openly about how, was new, and it grew up alongside Greek drama, history and philosophy.",
    ], "Athens invented direct democracy: citizens voted on laws in person and filled offices by lottery. Citizenship was limited to a minority.", [
      Q("What made Athenian democracy “direct”?", "Citizens voted on laws themselves", ["They elected a president", "A king approved each law", "Judges wrote the laws"], "There were no representatives standing between citizens and decisions."),
      Q("How were most Athenian officials chosen?", "By lottery", ["By election", "By inheritance", "By examination"], "Athenians thought elections favoured the wealthy and well-known."),
      Q("Who could vote in ancient Athens?", "Free adult male citizens", ["Everyone living in the city", "All adults, including women", "Only landowners over 50"], "Women, slaves and foreign residents were excluded."),
    ]),
    L("anc-3", "Rome: republic to empire", [
      "Rome began as a small city and, by tradition, expelled its last king in 509 BC. It became a republic: power was shared between two consuls elected each year, the Senate and popular assemblies. Over four centuries it conquered Italy and then the whole Mediterranean.",
      "Success broke it. Wealth flowed to a few. Armies came to depend on their generals for pay and land, and became loyal to them instead of the state. In 49 BC Julius Caesar led his army across the river Rubicon into Italy, won a civil war and was made dictator for life. Senators assassinated him on the Ides of March, 44 BC.",
      "That did not restore the republic. His heir Octavian defeated all rivals and in 27 BC took the name Augustus. He kept the Senate and the old titles but held the real power: Rome's first emperor. The empire in the west lasted until AD 476, and its law, language and roads shaped Europe long after.",
    ], "Rome's republic conquered the Mediterranean, then collapsed under generals with personal armies. Augustus kept its forms and became emperor.", [
      Q("What did it mean when Caesar crossed the Rubicon in 49 BC?", "He led his army into Italy, starting a civil war", ["He retired from politics", "He was crowned king", "He discovered a new province"], "It is still a phrase for passing the point of no return."),
      Q("Who was Rome's first emperor?", "Augustus", ["Julius Caesar", "Nero", "Constantine"], "Caesar was dictator. His heir Octavian became Augustus in 27 BC."),
      Q("Why did the Roman Republic break down?", "Armies became loyal to their generals instead of the state", ["It ran out of soldiers", "The Senate abolished itself", "A plague killed the consuls"], "Generals with personal armies could take power by force."),
    ]),
    L("anc-4", "The Silk Road", [
      "Around 2,000 years ago two great empires sat at opposite ends of Eurasia: Rome in the west and Han China in the east. They never met directly. But from about 130 BC a web of trade routes linked them across Central Asia. A nineteenth-century geographer later named it the Silk Road.",
      "It was never one road, and few people travelled its length. Goods passed between merchants in stages, growing more expensive at each exchange. Silk went west; for centuries only China knew how to make it. Gold, silver, glass and horses went east.",
      "Ideas travelled the same routes. Buddhism spread from India into China along them. Paper-making and gunpowder moved slowly west. So did disease: the Black Death, which killed perhaps a third or more of Europe's people in the 1340s, is thought to have travelled along these trade networks. The world was connected long before it was modern.",
    ], "The Silk Road was a relay of trade routes linking China and the Mediterranean. It carried goods, religions, inventions and plague.", [
      Q("Which two empires were linked by the Silk Road?", "Rome and Han China", ["Egypt and Greece", "Persia and Britain", "The Aztecs and Spain"], "They sat at opposite ends of Eurasia and traded through intermediaries."),
      Q("How did goods typically cross the Silk Road?", "Passed between merchants in stages", ["Carried by one caravan the whole way", "Shipped by sea only", "Delivered by imperial armies"], "Few individuals ever travelled the full distance."),
      Q("Which religion spread from India to China along these routes?", "Buddhism", ["Christianity", "Shinto", "Judaism"], "Monks and merchants carried it through Central Asia."),
    ]),
  ],
};

export const talk = {
  id: "talk", title: "Communication and negotiation", tag: "Skills", icon: "🗣️", color: "#ec4899",
  blurb: "Listening, negotiating, persuading and giving feedback: skills that pay off in every room.",
  lessons: [
    L("tal-1", "Listening properly", [
      "Most people in a conversation are not listening. They are waiting to talk, rehearsing their reply while the other person finishes. The speaker can usually tell.",
      "Active listening is a set of habits that fix this. Give full attention: phone away, eyes up. Don't interrupt. Then reflect back what you heard in your own words: “So the deadline isn't the problem, it's that you weren't asked.” If you got it wrong, they'll correct you, and either way they know you were trying to understand.",
      "Ask open questions, ones that can't be answered yes or no. “What happened next?” gets more than “Was it bad?” And notice the feeling as well as the facts; naming it, “that sounds frustrating”, often calms a tense exchange. People become far more willing to hear your view once they believe you've understood theirs.",
    ], "Attend fully, reflect back what you heard, ask open questions. People listen to you after they feel heard.", [
      Q("What is “reflecting back” in active listening?", "Restating what you heard in your own words", ["Repeating their words exactly", "Giving your opinion", "Changing the subject"], "It checks your understanding and shows you were listening."),
      Q("Which is an open question?", "“What happened next?”", ["“Was it bad?”", "“Did you finish?”", "“Are you okay?”"], "Open questions can't be answered with yes or no."),
      Q("Why does listening well make you more persuasive?", "People are more open to your view once they feel understood", ["It tires the other person out", "It lets you find their mistakes", "It means you speak last"], "Feeling heard lowers defensiveness."),
    ]),
    L("tal-2", "Negotiation: know your alternatives", [
      "In any negotiation your power comes mostly from one thing: what you will do if there is no deal. Negotiators call this your BATNA, the best alternative to a negotiated agreement. A job candidate with another offer in hand negotiates very differently from one with nothing.",
      "So the first step is to improve your alternative before you sit down, and to think hard about the other side's. Your BATNA sets your walk-away point. Any deal worse than it should be refused, however much time you've already put in.",
      "The second idea is to look past positions to interests. A position is what someone says they want: “I need $10,000 more.” An interest is why: security, recognition, a specific expense. Two people can hold opposed positions and compatible interests. Ask why, and you often find trades that cost you little and matter a lot to them, like a start date, a title or flexibility.",
    ], "Your leverage is your best alternative, so improve it first. Then negotiate over interests, the reasons behind demands, not positions.", [
      Q("What is a BATNA?", "Your best option if no agreement is reached", ["Your opening offer", "The highest price you'd pay", "A written contract"], "Best Alternative To a Negotiated Agreement."),
      Q("In negotiation, what is an “interest”?", "The underlying reason behind what someone asks for", ["The stated demand", "The interest rate on a loan", "A hobby you share"], "Positions are what people say they want. Interests are why."),
      Q("You've spent weeks on a deal that is now worse than your alternative. What should you do?", "Walk away", ["Accept, given the time invested", "Accept and renegotiate later", "Split the difference"], "Time already spent is a sunk cost. Your BATNA sets the floor."),
    ]),
    L("tal-3", "Why people say yes", [
      "Psychologist Robert Cialdini spent years studying salespeople, fundraisers and recruiters to find what reliably gets people to agree. He described a small set of principles that work because they are usually sensible shortcuts.",
      "Reciprocity: we feel obliged to return favours, which is why free samples work. Social proof: when unsure, we copy what others do, hence “bestseller” and review counts. Scarcity: things seem more valuable when limited, hence “only 2 left”. Authority, liking, and commitment and consistency complete the list: we defer to experts, agree with people we like, and act in line with what we've already said.",
      "Knowing them cuts both ways. Use them honestly and they help people act on good information: real testimonials, real deadlines. And when you feel a sudden urge to say yes, check which lever is being pulled. A countdown timer changes nothing about whether the thing is worth buying.",
    ], "Reciprocity, social proof, scarcity, authority, liking and consistency drive most persuasion. Spot the lever before you agree.", [
      Q("A shop hands out free samples. Which principle is it relying on?", "Reciprocity", ["Scarcity", "Authority", "Social proof"], "A small gift creates a felt obligation to give something back."),
      Q("“Only 2 left in stock!” appeals to which principle?", "Scarcity", ["Liking", "Reciprocity", "Consistency"], "Limited availability makes things seem more valuable."),
      Q("What is social proof?", "Looking to what other people do to decide what to do", ["Proving a claim with data", "Showing ID", "Signing a contract"], "It is why ratings and “most popular” labels work."),
    ]),
    L("tal-4", "Giving feedback people can use", [
      "Most critical feedback fails because it is vague or about character. “You're careless” gives the person nothing to act on and something to defend. Useful feedback is specific, about behaviour, and timely.",
      "A simple structure is situation, behaviour, impact. Name when and where. Describe what the person did, as a camera would have recorded it. Then say what effect it had. “In Tuesday's client call, you answered before she'd finished her question twice. She stopped raising concerns after that.” No labels, no guesses about motive.",
      "Then stop and ask for their view. You may be missing something. Agree on what happens next. Do it soon and in private, and use the same structure for praise: “great job” teaches nothing, while saying exactly what worked tells someone what to repeat. The standard to aim for is clear about the problem and plainly on the person's side.",
    ], "Describe the situation, the behaviour and its impact, then ask for their side. Specific and observable beats general and personal.", [
      Q("What are the three parts of the feedback structure in this lesson?", "Situation, behaviour, impact", ["Praise, criticism, praise", "Problem, blame, fix", "Ask, tell, repeat"], "When and where, what they did, what effect it had."),
      Q("Which is the most useful piece of feedback?", "“In the meeting you interrupted Sam twice, and he stopped contributing.”", ["“You're rude.”", "“You need a better attitude.”", "“People find you difficult.”"], "It is specific, observable and shows the effect."),
      Q("Why make praise specific too?", "It tells the person exactly what to repeat", ["It takes longer, which shows effort", "It avoids making others jealous", "General praise is against policy"], "“Great job” doesn't say what was great."),
    ]),
  ],
};
