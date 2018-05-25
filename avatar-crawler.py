import json

dota2heroes = []
dotabuffheroes = []
myHero = {}

with open('data.json') as f:
    data = json.load(f)

with open('dota2heroes.txt') as dota2heroesFile:
    for hero in dota2heroesFile:
        dota2heroes.append(hero.strip())

with open('dotabuffheroes.txt') as dotabuffheroesFile:
    for hero in dotabuffheroesFile:
        dotabuffheroes.append(hero.strip())

for i in range(len(dota2heroes)):
    formattDota2 = dota2heroes[i].strip().replace(" ", "_").replace("-", "").lower()
    formattDotaBuff = dotabuffheroes[i].strip().replace(" ", "-").lower().replace("'", "")

    data[dotabuffheroes[i]]['avatar'] = 'http://cdn.dota2.com/apps/dota2/images/heroes/%s_sb.png?v=4530740' % formattDota2

with open('data2.json', 'w') as f:
    json.dump(data, f, indent=4)

    
# http://cdn.dota2.com/apps/dota2/images/heroes/sven_hphover.png?v=4530740



