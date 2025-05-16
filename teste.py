from pathlib import Path
import requests
import json
import unicodedata
import unicodedata

def remover_acentos(texto):
    resultado = ''
    for caractere in texto:
        if caractere == 'ç' or caractere == 'Ç':
            resultado += caractere
        else:
            nfkd = unicodedata.normalize('NFKD', caractere)
            sem_acento = ''.join([c for c in nfkd if not unicodedata.combining(c)])
            resultado += sem_acento
    return resultado



def nomes():
    url = 'https://www.ime.usp.br/~pf/dicios/br-utf8.txt'
   
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


