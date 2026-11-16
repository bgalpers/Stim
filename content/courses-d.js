// Body & health · Computing & AI · Philosophy
import { L, Q } from "./make.js";

export const body = {
  id: "body", title: "How your body works", tag: "Health", icon: "🫀", color: "#ef4444",
  blurb: "Sleep, strength, food and fitness: what the evidence says about the machine you live in.",
  lessons: [
    L("bod-1", "What sleep is doing", [
      "Sleep runs in cycles of roughly 90 minutes, each moving through light sleep, deep sleep and REM, the stage with the most vivid dreams. Deep sleep is concentrated early in the night and REM toward morning, so cutting a night short costs you mostly REM.",
      "Two systems decide when you feel sleepy. Sleep pressure builds the longer you're awake, driven by a chemical called adenosine. Caffeine works by blocking adenosine's receptors, and it clears slowly: half is still in your system five or six hours later. The second system is your circadian clock, a roughly 24-hour rhythm set mainly by light.",
      "Bright light in the morning anchors that clock. Bright light late at night, including screens, pushes it later and delays the release of melatonin. Most adults need seven to nine hours, and a consistent wake time does more for sleep quality than almost anything else.",
    ], "Sleep pressure plus a light-set body clock decide when you sleep. Morning light, a steady wake time and early caffeine do most of the work.", [
      Q("How does caffeine keep you awake?", "It blocks the receptors for adenosine", ["It raises blood sugar", "It produces melatonin", "It speeds up your heart only"], "Adenosine builds sleep pressure. Caffeine hides the signal without removing it."),
      Q("What mainly sets your circadian clock?", "Light", ["Meal size", "Room temperature", "Exercise"], "Morning light anchors it. Late bright light pushes it later."),
      Q("If you cut your night short by waking early, which stage do you mostly lose?", "REM sleep", ["Deep sleep", "Light sleep", "None; cycles are identical"], "REM is concentrated in the last hours of the night."),
    ]),
    L("bod-2", "How muscle gets stronger", [
      "Muscle grows in response to a demand it isn't used to. Lifting something hard creates mechanical tension in the fibres. That signals the body to rebuild them slightly thicker and stronger. The growth happens during recovery, not during the workout.",
      "The governing principle is progressive overload. If you always do 20 push-ups, your body adapts to 20 push-ups and stops. To keep improving, the demand has to rise over time: more reps, more load, a harder variation or less rest.",
      "Three other inputs matter. Protein supplies the building material; research on people who train supports roughly 1.6 grams per kilogram of body weight a day. Sleep is when much of the repair happens. And consistency beats intensity: sets taken close to the point where you couldn't do another, a couple of times a week per muscle, outperform occasional heroic sessions.",
    ], "Muscle adapts to demands that keep rising. Train hard enough, add a little over time, eat enough protein and sleep.", [
      Q("What is progressive overload?", "Gradually increasing the demand on your muscles", ["Training to exhaustion every day", "Doing the same routine forever", "Lifting as fast as possible"], "Without a rising demand, the body has no reason to keep adapting."),
      Q("When does muscle growth actually happen?", "During recovery after training", ["During the workout itself", "Only while eating", "Only in the morning"], "Training is the signal. Rebuilding happens afterwards, much of it during sleep."),
      Q("About how much daily protein does research support for people training to build muscle?", "Around 1.6 g per kg of body weight", ["Around 0.2 g per kg", "Around 5 g per kg", "Protein doesn't matter"], "For a 70 kg person that is roughly 110 grams a day."),
    ]),
    L("bod-3", "Food as fuel", [
      "Food supplies energy through three macronutrients. Carbohydrate and protein each provide about 4 calories per gram. Fat provides about 9. Carbohydrate is the body's quickest fuel, fat its largest store, and protein mostly building material.",
      "Body weight over time follows energy balance: take in more than you use and the surplus is stored; take in less and stores are drawn down. Most of what you burn isn't exercise. It's your resting metabolism, simply keeping you alive, which accounts for well over half of daily energy use.",
      "Balance isn't the whole story, because foods differ in how full they keep you. Protein and fibre are the most satiating. In a tightly controlled study, people offered ultra-processed meals ate about 500 more calories a day than when offered unprocessed meals matched for nutrients. What you eat changes how much you want.",
    ], "Calories set the direction of weight change. Protein, fibre and less-processed food make the right amount easier to eat.", [
      Q("Which macronutrient has the most calories per gram?", "Fat", ["Protein", "Carbohydrate", "They are equal"], "Fat has about 9 calories per gram; the others about 4."),
      Q("Where does most of your daily energy use go?", "Resting metabolism", ["Exercise", "Digesting food", "Thinking"], "Keeping the body running at rest accounts for well over half."),
      Q("Which foods tend to keep you full longest?", "Those high in protein and fibre", ["Sugary drinks", "Ultra-processed snacks", "Anything low in fat"], "Protein and fibre are the most satiating per calorie."),
    ]),
    L("bod-4", "Cardio fitness", [
      "Cardiorespiratory fitness is how well your heart, lungs and muscles deliver and use oxygen. Its standard measure is VO2 max: the most oxygen you can use per minute at full effort. Higher fitness is among the strongest predictors of living longer that researchers have found.",
      "Training changes the hardware. The heart's main chamber gets larger and stronger, so it pumps more blood per beat, which is why fit people have low resting heart rates. Muscles grow more capillaries and more mitochondria, the structures that turn oxygen and fuel into energy.",
      "Two kinds of work build it. Easy, steady effort where you could still hold a conversation builds the base and can be done often. Short hard intervals push the ceiling. Health guidelines suggest at least 150 minutes of moderate activity a week, or 75 of vigorous, plus strength work on two days.",
    ], "Fitness is oxygen delivery. Lots of easy work plus a little hard work improves it, and it is strongly tied to how long you live.", [
      Q("What does VO2 max measure?", "The most oxygen your body can use per minute", ["Your maximum heart rate", "How much air your lungs hold", "Your blood pressure at rest"], "It is the standard measure of cardiorespiratory fitness."),
      Q("Why do fit people tend to have low resting heart rates?", "Their hearts pump more blood with each beat", ["Their blood is thinner", "They breathe more slowly", "They have fewer blood vessels"], "A stronger heart needs fewer beats to move the same blood."),
      Q("How much moderate activity do health guidelines recommend each week?", "At least 150 minutes", ["At least 20 minutes", "At least 600 minutes", "Exactly 60 minutes"], "Or 75 minutes of vigorous activity, plus two days of strength work."),
    ]),
  ],
};

export const tech = {
  id: "tech", title: "Computing and AI", tag: "Technology", icon: "💻", color: "#0ea5e9",
  blurb: "Bits, the internet, encryption and how language models learn: the ideas under the screen.",
  lessons: [
    L("tec-1", "Everything is bits", [
      "A computer stores and moves only one kind of thing: switches that are on or off. Each is a bit, written 1 or 0. Eight bits make a byte, which can take 256 different values.",
      "Numbers are written in binary, where each place is worth double the one to its right: 1, 2, 4, 8, 16. So 1011 is 8 + 2 + 1 = 11. Everything else is numbers by agreement. Text assigns a number to each character: capital A is 65. An image is a grid of pixels, each three numbers for red, green and blue. Sound is thousands of loudness measurements per second.",
      "This is why computing is so general. A machine that can store and transform numbers can handle anything that can be described as numbers. And because copying a number is exact, digital copies don't degrade the way a photocopy of a photocopy does.",
    ], "Computers handle only bits. Text, images and sound are all numbers under an agreed code, which is what makes one machine so general.", [
      Q("What is the binary number 1011 in ordinary decimal?", "11", ["5", "13", "1011"], "8 + 0 + 2 + 1 = 11."),
      Q("How many different values can one byte hold?", "256", ["8", "16", "1,000"], "Eight bits, each on or off: 2 to the power 8."),
      Q("How does a computer store a colour photo?", "As a grid of pixels, each a few numbers", ["As a tiny picture on the chip", "As a list of words describing it", "As a single very large letter"], "Each pixel records amounts of red, green and blue."),
    ]),
    L("tec-2", "How the internet delivers", [
      "The internet is a network of networks that agree on common rules. When you load a page, your request isn't sent as one piece. It is cut into small packets, each labelled with the address it's going to and the address it came from.",
      "Those addresses are IP addresses, numbers that identify a device on the network. People prefer names, so the Domain Name System, DNS, works as a phone book: it turns a name like wikipedia.org into the numeric address of the right server.",
      "Packets hop between routers, each of which passes them one step closer. Different packets may take different routes and arrive out of order. A protocol called TCP numbers them, reassembles them and asks for any that went missing. There is no central switchboard, which is why damage in one place rarely takes the whole network down.",
    ], "Data travels as addressed packets, DNS turns names into addresses, and TCP puts the pieces back together. No single point controls it.", [
      Q("What does DNS do?", "Translates domain names into numeric IP addresses", ["Encrypts your passwords", "Speeds up your Wi-Fi", "Stores web pages"], "It is the internet's phone book."),
      Q("How is data sent across the internet?", "Split into packets that may take different routes", ["As one continuous stream on a fixed line", "By satellite only", "Through one central computer"], "Packets are addressed individually and reassembled on arrival."),
      Q("What is TCP's job?", "Reassembling packets in order and re-requesting missing ones", ["Assigning domain names", "Displaying web pages", "Blocking viruses"], "It makes an unreliable network behave reliably."),
    ]),
    L("tec-3", "Encryption", [
      "Encryption scrambles a message so that only someone with the right key can read it. The oldest kind is symmetric: the same key locks and unlocks. It is fast, but it has a flaw. How do you get the key to the other person without someone intercepting it?",
      "Public-key cryptography, invented in the 1970s, solved that. Each person has two linked keys. The public key can be given to anyone and only locks. The private key is kept secret and unlocks. Anyone can send you a message that only you can open.",
      "It rests on maths that is easy one way and hard the other: multiplying two huge prime numbers is quick, but finding them again from the product is not practical. The padlock in your browser, HTTPS, uses public-key methods to agree a secret key with the website, then switches to fast symmetric encryption for the rest.",
    ], "Public-key encryption lets strangers communicate securely without sharing a secret first. Your browser uses it every time you see the padlock.", [
      Q("In public-key cryptography, which key must stay secret?", "The private key", ["The public key", "Both keys", "Neither key"], "The public key only locks. The private key unlocks."),
      Q("What problem did public-key cryptography solve?", "Sharing a key safely with someone you've never met", ["Making computers faster", "Compressing files", "Remembering passwords"], "Symmetric encryption needs both sides to already hold the same secret."),
      Q("What is the security of common public-key systems based on?", "Maths that is easy to do but very hard to reverse", ["Keeping the method secret", "Very long passwords", "Changing keys every second"], "Multiplying primes is easy; factoring the result is not."),
    ]),
    L("tec-4", "How language models learn", [
      "A large language model, the kind behind modern chatbots, does one thing at its core: given some text, it predicts what comes next. Text is split into tokens, pieces about the size of a short word, and the model outputs a probability for every possible next token.",
      "The model is a neural network: layers of simple units joined by billions of adjustable numbers called parameters. Training shows it enormous amounts of text with the next token hidden. Each wrong guess nudges the parameters to make the right answer more likely. Nobody writes rules for grammar or facts. They emerge from that process, repeated trillions of times.",
      "This explains both the strengths and the failures. Predicting text well requires absorbing a great deal about language and the world. But the model produces what is plausible, which is usually and not always what is true. A confident, fluent, wrong answer is called a hallucination, which is why important claims should be checked.",
    ], "Language models learn by predicting the next token across vast amounts of text. Fluent is not the same as correct, so verify what matters.", [
      Q("At its core, what is a language model trained to do?", "Predict the next token of text", ["Look up answers in a database", "Follow grammar rules written by hand", "Search the internet"], "Everything else it can do emerges from that one objective."),
      Q("What are a neural network's parameters?", "Adjustable numbers tuned during training", ["Rules written by programmers", "The questions users ask", "Stored copies of web pages"], "Training nudges billions of them to make better predictions."),
      Q("What is a “hallucination” in an AI model?", "A fluent, confident answer that is false", ["A crash", "A refusal to answer", "A slow response"], "The model produces what is plausible, which isn't always what is true."),
    ]),
  ],
};

export const philosophy = {
  id: "philosophy", title: "Big questions", tag: "Philosophy", icon: "🏛️", color: "#a855f7",
  blurb: "Socrates, the trolley problem, the Stoics and Descartes: four ways of thinking that still hold up.",
  lessons: [
    L("phi-1", "Socrates and the examined life", [
      "Socrates lived in Athens in the fifth century BC and wrote nothing. What we know comes mostly from his student Plato. He spent his days in the marketplace asking people who claimed to understand courage, justice or piety to say what those things were.",
      "His method was to ask for a definition, then test it with questions until it broke. Someone says courage is standing firm in battle. But isn't a clever retreat sometimes courageous? This patient cross-examination is the Socratic method. Its aim is not to win but to expose what you only thought you knew.",
      "When an oracle called him the wisest man in Athens, Socrates concluded it could only mean this: he knew that he did not know, while others believed they did. Athens tried him for corrupting the young and impiety, and executed him in 399 BC. At his trial he said the unexamined life is not worth living.",
    ], "Socrates' method is to test beliefs with questions until only what survives remains. Knowing the limits of your knowledge is where it starts.", [
      Q("What is the Socratic method?", "Testing ideas by asking a series of probing questions", ["Memorising speeches", "Voting on the truth", "Writing long treatises"], "He asked for definitions and then cross-examined them."),
      Q("In what sense did Socrates say he was wise?", "He knew that he did not know", ["He had read every book", "He had never lost an argument", "The gods spoke to him"], "Others mistook confidence for knowledge. He did not."),
      Q("How do we know what Socrates thought?", "Mainly through the writings of his student Plato", ["From his own books", "From his letters", "From inscriptions on his tomb"], "Socrates himself wrote nothing."),
    ]),
    L("phi-2", "The trolley problem", [
      "A runaway trolley is about to kill five people. You can pull a lever to send it down a side track, where it will kill one. Most people say pull it. Now change one detail: you can only stop the trolley by pushing a large man off a bridge into its path. Same numbers. Most people refuse.",
      "The two answers fit two great ethical traditions. Consequentialism, whose best-known form is utilitarianism, judges an act by its results: the right act produces the most good overall. Five lives outweigh one, in both cases.",
      "Deontology, associated with Immanuel Kant, holds that some acts are wrong in themselves, whatever they achieve. Kant argued you must never treat a person merely as a means to an end. Pushing the man uses him as a tool; diverting the trolley does not. The puzzle endures because most of us feel the force of both views.",
    ], "Consequentialism judges results; deontology judges the act itself. The trolley cases show most people hold some of each.", [
      Q("What does utilitarianism say makes an action right?", "It produces the greatest overall good", ["It follows a religious rule", "It is what most people would do", "It is legal"], "It judges actions by their consequences."),
      Q("Which idea is central to Kant's ethics?", "Never treat a person merely as a means to an end", ["Always maximise happiness", "Do whatever feels natural", "Follow the majority"], "For Kant some acts are wrong whatever good they produce."),
      Q("Why do many people pull the lever but refuse to push the man?", "Pushing uses a person directly as a tool to save others", ["Fewer people are saved", "The lever is illegal", "The man is more important"], "The numbers match. What differs is how the one person is treated."),
    ]),
    L("phi-3", "Stoicism", [
      "Stoicism began in Athens around 300 BC and flourished in Rome. Its best-known writers could hardly be more different: Epictetus, born a slave; Seneca, a wealthy statesman; and Marcus Aurelius, emperor of Rome, whose private notebook survives as the Meditations.",
      "Its central idea is the dichotomy of control. Some things are up to us: our judgements, intentions and actions. Everything else is not: other people, reputation, the weather, the past, the outcome. The Stoics argued that distress comes from demanding control over the second group.",
      "Epictetus put it this way: people are disturbed not by things but by their opinions about things. The practice is to notice the judgement you've added to an event and ask whether it is true. This is not suppressing feeling. It is where modern cognitive behavioural therapy got its core technique, and the therapy's founders said so.",
    ], "Put your effort into what you control, your judgements and actions, and accept what you don't. The Stoic test is which side of that line a worry falls on.", [
      Q("What is the Stoic “dichotomy of control”?", "Separating what is up to us from what is not", ["Controlling other people", "Avoiding all emotion", "Choosing between two careers"], "Judgements and actions are ours. Outcomes and other people are not."),
      Q("According to Epictetus, what disturbs people?", "Their judgements about events", ["The events themselves", "Lack of money", "The gods"], "The Stoic practice is to examine the judgement, not the event."),
      Q("Which Roman emperor wrote the Stoic notebook known as the Meditations?", "Marcus Aurelius", ["Nero", "Augustus", "Julius Caesar"], "It was a private journal, never meant for publication."),
    ]),
    L("phi-4", "Descartes and doubt", [
      "In 1641 the French philosopher René Descartes set out to find something he could be absolutely certain of. His method was to doubt everything that could possibly be doubted and see what remained.",
      "The senses sometimes deceive, so set them aside. You might be dreaming right now. Worse, imagine a powerful demon dedicated to deceiving you about everything, even arithmetic. Could anything survive that?",
      "One thing does. To be deceived, you must exist. To doubt is to think, and thinking requires a thinker. “I think, therefore I am”, in Latin cogito ergo sum. Descartes tried to rebuild all knowledge on that foundation, and few think he fully succeeded. But the questions he raised, how we know anything outside our own minds and how mind relates to body, shaped philosophy for centuries, and the demon returns in every story about living in a simulation.",
    ], "Doubt everything you can and one certainty remains: something is doing the doubting. How to get from there to the outside world is still argued over.", [
      Q("What does “cogito ergo sum” mean?", "I think, therefore I am", ["Knowledge is power", "I came, I saw, I conquered", "The die is cast"], "Doubting is thinking, and thinking requires a thinker."),
      Q("What was the point of Descartes' deceiving demon?", "To test whether any belief could survive the most extreme doubt", ["To prove demons exist", "To explain bad dreams", "To attack the church"], "It is a thought experiment, a way of pushing doubt as far as it will go."),
      Q("What was Descartes searching for with his method of doubt?", "A belief that could not possibly be false", ["The meaning of life", "A proof that the senses are reliable", "A new kind of mathematics"], "He wanted a certain foundation on which to rebuild knowledge."),
    ]),
  ],
};
