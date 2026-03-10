import re

with open('/Users/davidrose/.gemini/antigravity/playground/crystal-filament/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# DAY 1
html = html.replace('8:00a</span></div>', '9:30a</span></div>')
html = html.replace('8:40a</span><span class="duration">40 min</span>', '10:00a</span><span class="duration">20 min</span>')
html = html.replace('10:30a</span><span class="duration">1 hr ride</span>', '11:00a</span><span class="duration">30 min ride</span>')
html = html.replace('1:00p</span><span class="duration">1.5 hr</span>', '1:30p</span><span class="duration">45 min</span>')
html = html.replace('5:00p</span><span class="duration">2.5 hr</span>', '4:00p</span><span class="duration">1 hr 15 min</span>')
html = html.replace('6:00p</span></div>', '5:00p</span></div>')

# DAY 2
html = html.replace('7:30a</span><span class="duration">departure</span>', '9:30a</span><span class="duration">departure</span>')
html = html.replace('8:15a</span><span class="duration">15 min</span>', '9:45a</span><span class="duration">15 min</span>')
html = html.replace('9:30a</span><span class="duration">1.5 hr ride</span>', '10:30a</span><span class="duration">45 min ride</span>')
html = html.replace('1:00p</span><span class="duration">2 hr ride</span>', '1:00p</span><span class="duration">1 hr ride</span>')
html = html.replace('4:30p</span><span class="duration">2.5 hr ride</span>', '3:30p</span><span class="duration">1 hr 15 min ride</span>')

# DAY 3
html = html.replace('8:30a</span><span class="duration">departure</span>', '9:30a</span><span class="duration">departure</span>')
html = html.replace('12:00p</span><span class="duration">2 hr ride</span>', '11:00a</span><span class="duration">1 hr ride</span>')
html = html.replace('2:30p</span><span class="duration">1.5 hr ride</span>', '1:30p</span><span class="duration">45 min ride</span>')
html = html.replace('3:30p</span></div>', '2:30p</span></div>')

# DAY 4
html = html.replace('8:30a</span><span class="duration">30 min</span>', '9:30a</span><span class="duration">15 min</span>')
html = html.replace('11:30a</span><span class="duration">2 hr ride</span>', '11:00a</span><span class="duration">1 hr ride</span>')
html = html.replace('2:00p</span><span class="duration">1 hr</span>', '1:30p</span><span class="duration">30 min</span>')
html = html.replace('3:00p</span><span class="duration">30 min</span>', '2:30p</span><span class="duration">15 min</span>')

with open('/Users/davidrose/.gemini/antigravity/playground/crystal-filament/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
