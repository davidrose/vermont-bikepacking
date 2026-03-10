import re

html_path = '/Users/davidrose/.gemini/antigravity/playground/crystal-filament/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

replacements = [
    (r'Park cars at Airport Park in Colchester.*?Island Line Trail\.',
     'Ditch the four-wheeled metal cage here at Airport Park in Colchester! It\'s completely free overnight parking in a neighborhood so sleepy the raccoons are probably named "Reginald." This is the prime launching pad directly onto the Island Line Trail. Saddle up, lock the cars, and say goodbye to civilization.'),
    
    (r'The main event.*?lake and mountains\.',
     'The absolute main event. You are about to ride on a 3-mile ribbon of gravel floating magically in the dead center of Lake Champlain. Prepare for 360-degree views of water and mountains that will make your eyeballs weep tears of immense joy. Pray there is no crosswind, or you might end up feeding the lake trouts!'),
    
    (r'Take the bike ferry across the 200-foot gap.*?credit cards accepted\)\.',
     'Ah, the "Local Motion" Bike Ferry. Because skipping your e-bike over a 200-foot gap in the water is frowned upon. The ferry runs continuously from 10am to 6pm, saving weary travelers from turning around. It\'s an $8 voyage where you can feel like a hardy sea captain for exactly 4 minutes. Yes, they take Apple Pay.'),
    
    (r'Classic general store on North Hero.*?Eat on the porch\.',
     'Behold the ultimate beacon of provisions: Hero\'s Welcome! This general store is stuffed to the gills with sandwiches so massive they have their own gravity. Grab local cider, a borderline-concerning amount of pastries, and maybe a weird wooden duck souvenir. Eat triumphantly on the porch while judging the boaters.'),
     
    (r'Resupply stop\. Last major town before turning east.*?beverages\.',
     'St. Albans: The last bastion of modern convenience before we disappear into the Kingdom! This is your final chance to buy anything you forgot, like bug spray, gummy bears, or spare inner tubes. Stock up heavily on camp food and enough liquid fortitude to get you through the Vermont wilderness.'),
     
    (r'The start of the Lamoille Valley Rail Trail.*?western 20 miles\.',
     'The holy grail of gravel: The Lamoille Valley Rail Trail. 93 glorious miles slicing right through the state\'s maple-syrup-filled heart. We\'re biting off the western 20 miles. It\'s flat, it\'s crushed gravel, and it\'s totally sheltered by trees, meaning your e-bike batteries are going to feel like absolute superheroes here.'),
     
    (r'Walk to the falls from your site.*?chase the waterfall\.',
     'Once you set up the tents, practically fall out of your sleeping bag and walk to Brewster River Falls. It\'s a shockingly cold, crystal-clear swimming hole right below a 20-foot cascade. The campground owners literally tell people to "go chase the waterfall." Do not question them. Just plunge into the icy, majestic waters.'),
     
    (r'Coffee, breakfast sandwiches, and pastries right on the LVRT.*?Fuel up for the day\.',
     'Wake up and smell the artisanal roasting! Two Son\'s Bakehouse is conveniently perched right on our trail. Go absolutely feral on their breakfast sandwiches, inject some caffeine directly into your veins, and grab as many pastries as your pockets can hold. Today is powered purely by carbohydrates.'),
     
    (r'Amazing local brewery housed in an old warehouse.*?Great outdoor beer garden\.',
     'Wait, an early detour for craft beer? Oh, absolutely. Lost Nation Brewing is an old warehouse masquerading as the mecca of Gose and IPAs. Their outdoor beer garden is the perfect place to sit back, unbuckle the helmet, and pretend we aren\'t about to pedal another 20 miles. Hydration is key, people.'),
     
    (r'Great cafe in Hardwick.*?Last good coffee before the woods\.',
     'Front Seat Coffee in Hardwick is your last chance to feel like a fancy city person. They have Cardamom Rose Lattes! Drink something exquisite and grab a scone, because after this, we are trading civilization for the deep, dark, beautiful woods of the Northeast Kingdom. Savor the espresso.'),
     
    (r'A quick 5-mile road detour to the best brewery in the world.*?Worth the climb if thirsty\.',
     'The route begs us to take a 5-mile detour to Hill Farmstead. It is literally rated the #1 brewery in the entire world. Yes, the WORLD. Are we going to climb a massive hill just for a glass of Edward pale ale? If the e-bikes have juice, the answer is a resounding, unapologetic "yes."'),
     
    (r'Deep in Groton State Forest.*?Very remote and quiet\.',
     'Welcome to New Discovery State Park, buried deep in the silent embrace of Groton State Forest. Prepare for massive 1930s CCC-built stone fireplaces, lean-tos, and an unsettling amount of quiet. It is incredibly remote, so if anyone starts telling ghost stories, you are legally allowed to ride away into the night.')
]

for pattern, replacement in replacements:
    html, count = re.subn(pattern, replacement, html, flags=re.DOTALL)
    if count == 0:
        print(f"Warning: pattern not found! -> {pattern[:30]}...")

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print("Finished updates.")
