import requests
import json
from bs4 import BeautifulSoup

allHeroes = {}

with open('heroes.txt') as heroesFile:
    for hero in heroesFile:
        formattedHero = hero.strip().replace(" ", "-").lower().replace("'", "")
        headers = {'user-agent': 'my-app/0.0.1'}
        url = 'https://www.dotabuff.com/heroes/%s' %formattedHero 
        r = requests.get(url, headers=headers)
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
        allHeroes[hero.strip()] = {'bestAgaint': bestAgaintHeroes, 'worstAgaint': worstAgaintHeroes}

with open('data.json', 'w') as f:
    json.dump(allHeroes, f)

