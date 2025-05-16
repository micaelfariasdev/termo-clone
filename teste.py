from pathlib import Path
import requests
import json
import unicodedata



def nomes():
    url = 'https://www.ime.usp.br/~pf/dicios/br-sem-acentos.txt'
   
    resposta = requests.get(url)
    resposta = resposta.text.split('\n')
   

    arquivo = Path('public/arquivo.txt')

    if not arquivo.exists():
        with open(arquivo, 'w', encoding='utf-8') as f:
            for i in resposta[:-1]:
                if i[0] == '':
                    pass
                if i[0].isupper():
                    pass
                if len(i) == 5:
                     f.write(f'{i}\n')

    with open('arquivo.txt', 'a', encoding='utf-8') as f:
        for i in resposta[:-1]:
                if i[0] == '':
                    pass
                if i[0].isupper():
                    pass
                if len(i) == 5:
                     f.write(f'{i}\n')

nomes()