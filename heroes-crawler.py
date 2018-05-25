import requests
import json
from bs4 import BeautifulSoup

dota2heroes = []
dotabuffheroes = []
allHeroes = {}

with open('dota2heroes.txt') as dota2heroesFile:
    for hero in dota2heroesFile:
        dota2heroes.append(hero.strip())

with open('dotabuffheroes.txt') as dotabuffheroesFile:
    for hero in dotabuffheroesFile:
        dotabuffheroes.append(hero.strip())

for i in range(len(dota2heroes)):
    if dota2heroes[i].strip() != 'Skywrath_Mage':
        formattDota2 = dota2heroes[i].strip().replace(" ", "_").replace("-", "").lower()
    else: 
        formattDota2 = dota2heroes[i].strip()
    formattDotaBuff = dotabuffheroes[i].strip().replace(" ", "-").lower().replace("'", "")
    headers = {'user-agent': 'my-app/0.0.1'}
    url1 = 'http://www.dota2.com/hero/%s' %formattDota2 
    r1 = requests.get(url1, headers=headers)
    soup1 = BeautifulSoup(r1.text, 'html.parser')
    img = soup1.find("img", id="heroTopPortraitIMG")
    print formattDota2
    print img
    url = 'https://www.dotabuff.com/heroes/%s' %formattDotaBuff 
    r = requests.get(url, headers=headers, timeout=30)
    soup = BeautifulSoup(r.text, 'html.parser')
    outterDiv = soup.find_all("div", class_="container-inner container-inner-content")
    innerDiv = outterDiv[0].find("div", class_="content-inner")
    divcol8 = innerDiv.find("div", class_="col-8")
    sections = divcol8.find_all("section")
    bestAgaintsBody = sections[-2].find("tbody")
    worstAgaintsBody = sections[-1].find("tbody")
    bestAgaintHeroes = []
    worstAgaintHeroes = []

    for heroes in bestAgaintsBody.contents:
        bestAgaintHeroes.append(heroes.contents[1].a.string)

    for heroes in worstAgaintsBody.contents:
        worstAgaintHeroes.append(heroes.contents[1].a.string)
    print formattDotaBuff
    print bestAgaintHeroes
    print worstAgaintHeroes
    allHeroes[dotabuffheroes[i].strip()] = {'bestAgaint': bestAgaintHeroes, 'worstAgaint': worstAgaintHeroes, 'image': img['src'] }
    with open('data.json', 'w') as f:
        json.dump(allHeroes, f, indent=4)

