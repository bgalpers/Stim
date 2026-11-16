// Finance + History. Each lesson: a short read, one takeaway, three questions.
// quiz item: { q, o: [options], a: index of the right option, why }

export const finance = {
  id: "finance", title: "Finance foundations", tag: "Finance",
  blurb: "Six ideas that sit under almost every money decision, from a savings account to valuing a company.",
  lessons: [
    {
      id: "fin-1", title: "The time value of money",
      body: [
        "A dollar today is worth more than a dollar a year from now. That is not a statement about inflation. It is true because a dollar you hold today can be put to work: lent out, invested, or used to pay down a debt. Whatever it would earn over the year is what you give up by waiting. Finance calls that the opportunity cost of capital.",
        "The idea gives you a way to compare money at different dates. To move money forward in time you compound it: $100 at 5% a year becomes $105 after one year and $110.25 after two. To move money backward you discount it, which is the same sum in reverse. $105 arriving in a year, discounted at 5%, is worth $100 today. That figure is its present value.",
        "The rate you use matters enormously. A promise of $1,000 in ten years is worth about $614 today at 5%, but only about $386 at 10%. The higher the rate, and the longer the wait, the less a future payment is worth now. Riskier promises deserve higher discount rates, because you need more compensation to accept the chance of not being paid.",
        "Almost everything else in finance is this one idea applied carefully. A bond is a set of future payments discounted to today. A share of stock is a claim on a company's future cash, discounted to today. A loan, a lease, a pension, a lottery prize paid over twenty years: each is a stream of dated cash flows, and each has a present value.",
      ],
      takeaway: "Money has a date attached. To compare two amounts, bring them to the same date using a rate that reflects what else the money could earn.",
      quiz: [
        { q: "Why is a dollar today worth more than a dollar in a year, even with zero inflation?", o: ["Banks charge fees over time", "It can be invested and earn a return in the meantime", "Currency loses legal value as it ages", "Taxes always rise"], a: 1, why: "The dollar you hold now can earn something during the year. Waiting means giving that up." },
        { q: "What is the present value of $105 received in one year at a 5% discount rate?", o: ["$110.25", "$105", "$100", "$95"], a: 2, why: "$105 ÷ 1.05 = $100. Discounting is compounding in reverse." },
        { q: "If you raise the discount rate, the present value of a distant payment…", o: ["falls", "rises", "stays the same", "becomes negative"], a: 0, why: "A higher rate shrinks future money more: $1,000 in ten years is about $614 at 5% and about $386 at 10%." },
      ],
    },
    {
      id: "fin-2", title: "Compounding and the rule of 72",
      body: [
        "Simple interest pays you on your original deposit only. Compound interest pays you on the deposit plus all the interest already earned. The difference looks small at first and becomes huge with time, because the base that earns interest keeps growing.",
        "Take $10,000 at 7% a year. With simple interest you earn $700 a year, so after 30 years you have $31,000. With compounding you have about $76,000. Nothing changed except that the interest was left in to earn interest of its own. Notice where the growth happens: the balance takes about ten years to double the first time, and in the final ten years it adds roughly $37,000.",
        "A handy shortcut is the rule of 72. Divide 72 by the annual rate in percent and you get the approximate number of years it takes money to double. At 6% that is 12 years. At 9% it is 8 years. At 2% it is 36 years. The rule works in reverse too: prices rising 3% a year halve the buying power of cash in about 24 years.",
        "Two practical lessons follow. First, time is the ingredient you cannot buy later. Someone who invests from age 22 to 32 and then stops can end up with more at 65 than someone who starts at 32 and invests every year until 65, at the same return. Second, compounding works against you on debt. A credit card balance at 24% doubles in about three years if nothing is paid.",
      ],
      takeaway: "Compounding is interest earning interest. Years in the market matter more than the size of any single deposit, and 72 ÷ rate tells you the doubling time.",
      quiz: [
        { q: "Using the rule of 72, about how long does money take to double at 8% a year?", o: ["4 years", "9 years", "12 years", "18 years"], a: 1, why: "72 ÷ 8 = 9 years." },
        { q: "What makes compound interest different from simple interest?", o: ["The rate rises every year", "Interest is paid monthly", "Interest is earned on past interest as well as the original sum", "It is guaranteed by the government"], a: 2, why: "The base that earns interest grows each period because earlier interest stays in." },
        { q: "A credit card balance at 24% interest with no payments roughly doubles in…", o: ["3 years", "6 years", "12 years", "24 years"], a: 0, why: "72 ÷ 24 = 3. Compounding works the same way on debt." },
      ],
    },
    {
      id: "fin-3", title: "Stocks and bonds: owning versus lending",
      body: [
        "Companies raise money in two basic ways. They can borrow it, or they can sell a piece of themselves. A bond is the first: you lend money and receive fixed interest payments, called coupons, plus your principal back at maturity. A stock is the second: you own a share of the business and of whatever is left after everyone else has been paid.",
        "That ordering is the key to their different risks. Bondholders are paid before shareholders. If a company fails, lenders have first claim on what remains and shareholders often get nothing. In exchange for standing last in line, shareholders have no ceiling on their return. If profits grow tenfold, the bondholder still receives the same coupon, while the owner's share is worth far more.",
        "So stocks are riskier and, over long periods, have been rewarded for it. US stocks have returned roughly 10% a year over the past century before inflation, against roughly 4% to 5% for government bonds. But stocks can lose a third or more of their value in a bad year, and stay down for years.",
        "Bonds have their own risk: interest rates. Suppose you hold a bond paying 3% and new bonds start paying 5%. Nobody will pay full price for yours, so its market price falls until its yield matches. Bond prices and interest rates move in opposite directions, and the longer a bond has until maturity, the more its price swings when rates change.",
      ],
      takeaway: "A bond is a loan with a fixed, senior claim. A stock is ownership with a leftover, unlimited claim. More uncertainty, more expected return.",
      quiz: [
        { q: "If a company goes bankrupt, who is paid first?", o: ["Common shareholders", "Bondholders", "Whoever bought most recently", "They are paid equally"], a: 1, why: "Lenders have a senior claim. Shareholders get what is left, which is often nothing." },
        { q: "Interest rates rise sharply. What happens to the price of existing bonds?", o: ["It rises", "Nothing", "It falls", "They are cancelled"], a: 2, why: "Old bonds with lower coupons are less attractive, so their prices drop until their yields match new bonds." },
        { q: "Why have stocks earned more than bonds over long periods?", o: ["Shareholders accept more risk and stand last in line", "Stocks pay fixed coupons", "Governments guarantee stock returns", "Bonds are taxed twice"], a: 0, why: "Higher expected return is compensation for a riskier, residual claim." },
      ],
    },
    {
      id: "fin-4", title: "Risk, return and diversification",
      body: [
        "In finance, risk usually means uncertainty about outcomes: how widely an investment's results might vary. Investors dislike that uncertainty, so they demand a higher expected return to bear it. That is why a start-up's shares must offer more upside than a Treasury bill.",
        "But not all risk is rewarded. Part of any single stock's risk is specific to that company: a failed product, a lawsuit, a bad chief executive. The rest is market risk, the kind that hits nearly everything at once, such as a recession or a jump in interest rates.",
        "Company-specific risk can be diluted almost for free by owning many different things. If you hold one stock and it collapses, you lose everything. If you hold five hundred, one collapse barely registers, and the surprises, good and bad, tend to cancel. This works because the holdings do not move in perfect step. The lower the correlation between them, the more the bumps offset.",
        "Economist Harry Markowitz showed this formally in 1952 and it is often called the only free lunch in investing: you can cut risk without cutting expected return. What diversification cannot remove is market risk. In 2008 almost every stock fell together. That remaining risk is the one investors are actually paid to carry.",
        "The practical upshot is the case for broad index funds. A fund holding the whole market gives you the market's return with company-specific risk nearly gone, at very low cost. Most professional stock pickers fail to beat that after fees over long periods.",
      ],
      takeaway: "Spread across many unrelated holdings and company-specific risk mostly disappears. Market risk stays, and that is the risk you are paid for.",
      quiz: [
        { q: "Which risk can diversification largely remove?", o: ["A global recession", "Rising interest rates", "Risk specific to one company", "Inflation"], a: 2, why: "A lawsuit or failed product at one firm barely matters in a portfolio of hundreds." },
        { q: "Diversification works best when your holdings…", o: ["have low correlation with each other", "are all in the same industry", "all rise together", "are chosen by one manager"], a: 0, why: "If holdings do not move in step, their ups and downs partly cancel." },
        { q: "Why is diversification called a “free lunch”?", o: ["Index funds charge no fees", "It guarantees profits", "It removes all risk", "It lowers risk without lowering expected return"], a: 3, why: "You shed unrewarded company-specific risk while keeping the market's expected return." },
      ],
    },
    {
      id: "fin-5", title: "The three financial statements",
      body: [
        "Every public company reports three linked statements. Together they answer three questions: did it make money, what does it own and owe, and where did the cash actually go?",
        "The income statement covers a period, such as a quarter. It starts with revenue, subtracts the cost of what was sold to get gross profit, subtracts operating costs like salaries and marketing to get operating income, then subtracts interest and tax to reach net income, the famous bottom line.",
        "The balance sheet is a snapshot at one moment. It lists assets (cash, inventory, factories), liabilities (debts, bills due) and shareholders' equity. It always balances: assets equal liabilities plus equity. Equity is simply what would belong to the owners if every asset were sold at its stated value and every debt repaid.",
        "The cash flow statement reconciles profit with cash. The two differ because accounting records revenue when it is earned, not when it is collected, and spreads the cost of long-lived assets over years as depreciation. A company can report a profit while running out of cash, for example if customers are slow to pay. The statement sorts cash into operating, investing and financing activities.",
        "The statements connect. Net income flows into equity on the balance sheet and is the starting line of the cash flow statement, and the change in cash at the bottom of that statement matches the change in the cash line on the balance sheet. Analysts read all three, because each one hides things the others reveal.",
      ],
      takeaway: "Income statement: profit over a period. Balance sheet: what is owned and owed at a moment. Cash flow statement: where the cash went. Profit is not cash.",
      quiz: [
        { q: "Which equation always holds on a balance sheet?", o: ["Revenue = costs + profit", "Assets = liabilities + equity", "Cash = net income", "Equity = revenue − debt"], a: 1, why: "Everything a company owns was funded either by borrowing or by its owners." },
        { q: "How can a profitable company run out of cash?", o: ["Profit is recorded when earned, which can be before cash is collected", "Net income is always paid out as dividends", "Balance sheets ignore cash", "Depreciation uses up cash each year"], a: 0, why: "Accrual accounting separates profit from cash. Slow-paying customers can starve a profitable firm." },
        { q: "Which statement shows performance over a period rather than at a single moment?", o: ["The balance sheet", "The shareholder register", "The audit letter", "The income statement"], a: 3, why: "The income statement covers a quarter or year. The balance sheet is a snapshot." },
      ],
    },
    {
      id: "fin-6", title: "What is a business worth?",
      body: [
        "There are two main ways to put a price on a company. One asks what similar companies sell for. The other asks what cash this company will produce.",
        "The first is relative valuation, using multiples. The price-to-earnings ratio divides the share price by earnings per share: a stock at $50 earning $2.50 a share trades at 20 times earnings. Bankers often prefer EV/EBITDA, which compares enterprise value (the value of equity plus net debt) with earnings before interest, tax, depreciation and amortisation. Because it includes debt, it lets you compare companies that are financed differently. If comparable firms trade at 10 times EBITDA and your target earns $50 million, a first guess at its enterprise value is $500 million.",
        "Multiples are quick, but they inherit the market's mood. If the whole sector is overpriced, so is your estimate.",
        "The second approach is the discounted cash flow, or DCF. You forecast the free cash flow the business will generate each year, the cash left after running and reinvesting in it, then discount each year's figure back to today at a rate reflecting the risk. Since a company may last indefinitely, you add a terminal value for everything beyond the forecast. The sum is what the business is worth.",
        "A DCF is the time value of money applied to a whole company. Its weakness is sensitivity: small changes in the growth or discount rate swing the answer widely, and the terminal value often makes up most of the total. Good analysts use both methods and look hard at where they disagree.",
      ],
      takeaway: "Multiples price a company by comparison. A DCF prices it by its own future cash, discounted to today. Each checks the other.",
      quiz: [
        { q: "A stock trades at $60 and earns $3 per share. What is its P/E ratio?", o: ["3", "18", "20", "57"], a: 2, why: "$60 ÷ $3 = 20 times earnings." },
        { q: "Why do analysts often use EV/EBITDA rather than P/E to compare companies?", o: ["It ignores profits", "It accounts for debt, so differently financed firms are comparable", "It is required by law", "It never changes"], a: 1, why: "Enterprise value includes net debt, so capital structure does not distort the comparison." },
        { q: "What is the main weakness of a DCF valuation?", o: ["It cannot value profitable firms", "It ignores the time value of money", "It only works for banks", "The result is very sensitive to assumed growth and discount rates"], a: 3, why: "Small changes in inputs, especially in the terminal value, move the answer a lot." },
      ],
    },
  ],
};

export const history = {
  id: "history", title: "The 20th century in six turns", tag: "History",
  blurb: "From Sarajevo to the fall of the Soviet Union: the events that shaped the modern world and how each led to the next.",
  lessons: [
    {
      id: "his-1", title: "1914: how Europe went to war",
      body: [
        "On 28 June 1914, a nineteen-year-old Bosnian Serb named Gavrilo Princip shot Archduke Franz Ferdinand, heir to the Austro-Hungarian throne, in Sarajevo. Within six weeks most of Europe was at war. The assassination was the spark. The fuel had been piling up for decades.",
        "Europe's great powers had sorted themselves into two armed camps. Germany and Austria-Hungary stood on one side. France, Russia and, more loosely, Britain stood on the other. The alliances were meant to deter war. In practice they meant a quarrel between any two could pull in everyone.",
        "Austria-Hungary blamed Serbia for the killing and saw a chance to crush a troublesome neighbour. Germany promised unconditional support, the so-called blank cheque. Austria issued an ultimatum designed to be rejected and declared war on Serbia on 28 July. Russia, Serbia's protector, began to mobilise its army.",
        "Here military planning took over from diplomacy. Germany's war plan assumed it would have to fight France and Russia at once, and called for knocking out France quickly by attacking through neutral Belgium before Russia was ready. Russian mobilisation therefore triggered a German attack in the west. Germany declared war on Russia on 1 August and on France on 3 August. When German troops entered Belgium, Britain declared war on 4 August.",
        "Leaders on all sides expected a short conflict. Instead, machine guns and artillery produced four years of trench warfare. By 1918 around nine to ten million soldiers were dead and four empires had fallen: the German, Austro-Hungarian, Russian and Ottoman.",
      ],
      takeaway: "A local crisis became a continental war because rigid alliances and mobilisation timetables left leaders little room to stop.",
      quiz: [
        { q: "Whose assassination in Sarajevo set off the crisis of July 1914?", o: ["Kaiser Wilhelm II", "Archduke Franz Ferdinand", "Tsar Nicholas II", "Otto von Bismarck"], a: 1, why: "Franz Ferdinand, heir to the Austro-Hungarian throne, was shot by Gavrilo Princip on 28 June 1914." },
        { q: "What was Germany's “blank cheque”?", o: ["A loan to Serbia", "A peace offer to France", "A promise of unconditional support to Austria-Hungary", "A trade treaty with Britain"], a: 2, why: "Germany's backing encouraged Austria-Hungary to take a hard line against Serbia." },
        { q: "What brought Britain into the war on 4 August 1914?", o: ["Germany's invasion of neutral Belgium", "An attack on London", "The sinking of the Lusitania", "Russia's surrender"], a: 0, why: "Germany's plan to defeat France quickly ran through Belgium, whose neutrality Britain had guaranteed." },
      ],
    },
    {
      id: "his-2", title: "Versailles and the unstable peace",
      body: [
        "The fighting stopped with an armistice on 11 November 1918. The peace was written in Paris the following year, mainly by Britain, France and the United States. Germany was not at the table. The Treaty of Versailles was signed on 28 June 1919, five years to the day after Sarajevo.",
        "The treaty took territory from Germany, including Alsace-Lorraine, which returned to France, and land given to a re-created Poland. It limited the German army to 100,000 men, banned an air force, and demilitarised the Rhineland. Article 231, the “war guilt” clause, made Germany accept responsibility for the war's damage. That was the legal basis for reparations, fixed in 1921 at 132 billion gold marks.",
        "Most Germans, who had been told they were winning until late 1918, regarded the treaty as a humiliation imposed by force. Economist John Maynard Keynes, who attended the conference, warned that the reparations would ruin Germany and destabilise Europe. In 1923, with France occupying the industrial Ruhr over missed payments, Germany's currency collapsed in hyperinflation. Savings built over lifetimes became worthless.",
        "The peace also created the League of Nations, an international body intended to settle disputes without war. It was US President Woodrow Wilson's idea, yet the US Senate refused to ratify the treaty and America never joined. Without it, and with no forces of its own, the League proved unable to stop aggression in the 1930s.",
        "Versailles did not make a second war inevitable. But it left a major power resentful, and gave extremists a grievance they would use relentlessly.",
      ],
      takeaway: "The 1919 settlement punished Germany enough to breed lasting resentment, but not enough to keep it weak, and the body meant to keep the peace lacked the power to do so.",
      quiz: [
        { q: "What did Article 231 of the Treaty of Versailles do?", o: ["Created the League of Nations", "Returned Alsace-Lorraine to France", "Banned the German navy", "Made Germany accept responsibility for the war"], a: 3, why: "The “war guilt” clause was the legal basis for demanding reparations." },
        { q: "Which country proposed the League of Nations but never joined it?", o: ["The United States", "France", "Japan", "Italy"], a: 0, why: "It was Woodrow Wilson's project, but the US Senate refused to ratify the treaty." },
        { q: "What happened to Germany's economy in 1923?", o: ["A stock market boom", "Hyperinflation destroyed the currency", "It adopted the US dollar", "Reparations were cancelled"], a: 1, why: "During the Ruhr crisis the mark collapsed and savings were wiped out." },
      ],
    },
    {
      id: "his-3", title: "The Great Depression",
      body: [
        "In October 1929 the New York stock market crashed. The crash did not cause the Great Depression by itself, but it marked the start of the deepest economic collapse of the modern era, and one that spread across the world.",
        "The real damage came through the banks. Deposits were not insured, so when people feared a bank might fail they rushed to withdraw, which made it fail. Around 9,000 US banks collapsed between 1930 and 1933, taking savings with them. As banks vanished, lending and the money supply shrank, prices fell, and firms cut wages and jobs. By 1933 about a quarter of American workers were unemployed and industrial output had roughly halved.",
        "Policy made it worse. The Federal Reserve let the money supply contract. Governments tried to balance budgets as revenue fell. In 1930 the United States passed the Smoot-Hawley tariff, other countries retaliated, and world trade shrank by about two thirds in value. The gold standard, which tied currencies to gold, transmitted the slump from country to country. Nations generally began to recover only after abandoning it.",
        "Franklin Roosevelt took office in March 1933 and launched the New Deal: public works, banking reform, deposit insurance through the new FDIC, and, in 1935, Social Security. Recovery was real but incomplete. Full employment returned only with wartime spending.",
        "The political effects were global. In Germany, where unemployment reached about six million, voters turned to the extremes. Adolf Hitler became chancellor in January 1933. The Depression also changed economics itself: Keynes argued that governments must spend to support demand in a slump, an idea that shaped policy for decades.",
      ],
      takeaway: "A financial crash turned into a decade-long depression because banks were allowed to fail, money and trade contracted, and governments tightened when they should have eased.",
      quiz: [
        { q: "Roughly what share of US workers were unemployed at the depth of the Depression in 1933?", o: ["5%", "10%", "25%", "60%"], a: 2, why: "About one in four American workers had no job." },
        { q: "Why did bank runs spread so easily in the early 1930s?", o: ["Deposits were not insured", "Banks were owned by the government", "Interest rates were too high to save", "Paper money was abolished"], a: 0, why: "With no deposit insurance, fear of a failure caused withdrawals that produced the failure. The FDIC was created in 1933 to stop this." },
        { q: "What did the 1930 Smoot-Hawley Act do?", o: ["Insured bank deposits", "Created Social Security", "Ended the gold standard", "Raised US tariffs, prompting retaliation and a collapse in trade"], a: 3, why: "Tariffs invited retaliation and world trade shrank dramatically." },
      ],
    },
    {
      id: "his-4", title: "The Second World War in outline",
      body: [
        "Hitler came to power promising to overturn Versailles. He rearmed, sent troops into the Rhineland in 1936, annexed Austria in 1938 and took Czechoslovakia in stages. Britain and France, desperate to avoid another war, gave way at Munich in 1938. When Germany invaded Poland on 1 September 1939, they finally declared war.",
        "The early years went Germany's way. Fast-moving tank and air attacks overran Poland, then Denmark, Norway, the Low Countries and France, which fell in June 1940. Britain fought on alone, surviving the air campaign known as the Battle of Britain.",
        "Two decisions in 1941 changed the war's scale. On 22 June Hitler invaded the Soviet Union, opening the largest and deadliest front in history. On 7 December Japan attacked the US fleet at Pearl Harbor, bringing the United States in. The Axis powers now faced an alliance with far greater manpower and industry.",
        "The tide turned in 1942 and 1943: at Midway in the Pacific, El Alamein in North Africa, and above all Stalingrad, where an entire German army was destroyed by February 1943. On 6 June 1944, D-Day, the Western Allies landed in Normandy. Squeezed from both sides, Germany surrendered on 8 May 1945. Japan surrendered in August after atomic bombs were dropped on Hiroshima and Nagasaki and the Soviet Union entered the Pacific war.",
        "The cost has no parallel. Estimates of the dead range from 70 to 85 million, most of them civilians. Nazi Germany murdered six million Jews in the Holocaust, along with millions of others. The war left Europe in ruins and two powers standing above the rest: the United States and the Soviet Union.",
      ],
      takeaway: "Germany's early victories were reversed once the Soviet Union and United States were in the war. Its end left two superpowers and a continent to rebuild.",
      quiz: [
        { q: "Which event began the war in Europe in September 1939?", o: ["The fall of France", "The attack on Pearl Harbor", "Germany's invasion of Poland", "The Munich conference"], a: 2, why: "Germany invaded Poland on 1 September 1939. Britain and France declared war two days later." },
        { q: "Which battle, ending in February 1943, is seen as the turning point on the Eastern Front?", o: ["Stalingrad", "Midway", "El Alamein", "Normandy"], a: 0, why: "An entire German army was destroyed at Stalingrad. Germany was largely on the defensive in the east afterwards." },
        { q: "What happened on 6 June 1944?", o: ["Germany invaded the Soviet Union", "The Western Allies landed in Normandy", "Japan surrendered", "Paris fell to Germany"], a: 1, why: "D-Day opened a western front in France." },
      ],
    },
    {
      id: "his-5", title: "The Cold War",
      body: [
        "The wartime alliance between the United States and the Soviet Union did not survive victory. The two had incompatible systems, capitalist democracy and one-party communism, and each feared the other meant to dominate. By 1947 Soviet-backed governments ruled Eastern Europe behind what Winston Churchill called an “iron curtain”.",
        "The American response was containment: stop communism spreading without fighting the Soviet Union directly. The Truman Doctrine of 1947 pledged support to countries resisting it. The Marshall Plan poured aid into rebuilding Western Europe. When Stalin blockaded West Berlin in 1948, the West supplied the city by air for almost a year. NATO, a military alliance, followed in 1949. The Soviets answered with the Warsaw Pact in 1955.",
        "Nuclear weapons set the rules. The Soviet Union tested its first bomb in 1949, and both sides built arsenals large enough to destroy each other many times over. This “mutually assured destruction” made direct war unthinkable, so the rivalry was fought by other means: an arms race, a space race, espionage, and proxy wars in Korea, Vietnam, Afghanistan and elsewhere, which killed millions.",
        "The most dangerous moment came in October 1962, when the United States discovered Soviet nuclear missiles in Cuba. For thirteen days the world stood close to nuclear war, until Moscow agreed to withdraw the missiles in exchange for a US pledge not to invade Cuba and the quiet removal of American missiles from Turkey.",
        "The shock led to a direct hotline and, later, arms control treaties and a period of eased tension called détente. The contest continued for almost three more decades.",
      ],
      takeaway: "Two nuclear-armed superpowers could not risk fighting each other, so they competed through alliances, arms and proxy wars for more than forty years.",
      quiz: [
        { q: "What was the US strategy of “containment”?", o: ["Invading the Soviet Union", "Withdrawing from Europe", "Preventing the spread of communism without direct war with the USSR", "Sharing nuclear weapons with allies"], a: 2, why: "Containment aimed to hold the line through aid, alliances and limited interventions." },
        { q: "What triggered the crisis of October 1962?", o: ["The Berlin blockade", "Soviet nuclear missiles in Cuba", "The launch of Sputnik", "The Korean War"], a: 1, why: "The Cuban Missile Crisis is generally seen as the closest the Cold War came to nuclear war." },
        { q: "Why did the superpowers never fight each other directly?", o: ["Nuclear arsenals meant war could destroy both", "The UN banned it", "They shared a border treaty", "Neither had a large army"], a: 0, why: "Mutually assured destruction pushed the conflict into proxy wars and competition instead." },
      ],
    },
    {
      id: "his-6", title: "1989 to 1991: the end of the Soviet bloc",
      body: [
        "By the 1980s the Soviet Union was in trouble. Its planned economy was stagnating, a war in Afghanistan was going badly, and matching American military spending was a heavy burden. In 1985 a new leader, Mikhail Gorbachev, set out to save the system by reforming it.",
        "He had two slogans. Glasnost, openness, loosened censorship and allowed criticism. Perestroika, restructuring, tried to modernise the economy. Just as important, Gorbachev signalled that Moscow would no longer use force to keep Eastern European governments in power, as it had in Hungary in 1956 and Czechoslovakia in 1968.",
        "Once that threat was gone, the regimes fell with startling speed. In Poland, the trade union Solidarity won partly free elections in June 1989. Hungary opened its border with Austria, and East Germans began to leave through it. On 9 November 1989, after a confused announcement that travel restrictions were lifted, crowds surged through the Berlin Wall, which had divided the city since 1961. Communist governments in Czechoslovakia, Bulgaria and Romania fell within weeks. Germany reunified on 3 October 1990.",
        "The same forces then pulled the Soviet Union itself apart. Openness exposed decades of failure, the economy worsened, and the republics, starting with the Baltic states, demanded independence. In August 1991 hard-liners tried to oust Gorbachev in a coup. It collapsed in three days and discredited the Communist Party. Gorbachev resigned on 25 December 1991 and the Soviet Union ceased to exist, replaced by fifteen independent countries.",
        "The Cold War ended without the great war everyone had feared. Its settlement, including NATO's later expansion eastward and Russia's sense of loss, still shapes world politics.",
      ],
      takeaway: "Reform meant to save the Soviet system removed the fear holding it together. Eastern Europe broke free in 1989 and the USSR dissolved two years later.",
      quiz: [
        { q: "What did Gorbachev's policy of glasnost mean?", o: ["Military build-up", "Collective farming", "Economic restructuring", "Openness and less censorship"], a: 3, why: "Glasnost was openness. Perestroika was restructuring of the economy." },
        { q: "What happened on 9 November 1989?", o: ["The Berlin Wall was opened", "The Soviet Union dissolved", "Germany reunified", "Solidarity won Poland's election"], a: 0, why: "Crowds crossed the Wall that night. Reunification followed in October 1990." },
        { q: "Why did Eastern Europe's communist governments fall so quickly in 1989?", o: ["NATO invaded", "Moscow made clear it would no longer use force to prop them up", "They ran out of oil", "The UN ordered elections"], a: 1, why: "Without the threat of Soviet intervention, the regimes had little to hold them in place." },
      ],
    },
  ],
};
