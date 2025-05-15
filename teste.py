from pathlib import Path
import requests
import json
import unicodedata

def remover_acentos(texto):
    texto_norm = unicodedata.normalize('NFD', texto)
    texto_sem_acentos = ''.join(c for c in texto_norm if unicodedata.category(c) != 'Mn')
    return texto_sem_acentos

def nomes():
    url = 'https://www.invertexto.com/ajax/words.php'
    dados = {
        'num_words': '10',
        'num_letters': '5'
    }
    resposta = requests.post(url, data=dados)
    resposta = json.loads(resposta.text)
    # print(resposta)
    # for i in resposta['result']:
    #     print(i['word'])

    arquivo = Path('public/arquivo.txt')

    if not arquivo.exists():
        with open(arquivo, 'w', encoding='utf-8') as f:
            for i in resposta['result']:
                palavra_sem_acentos = remover_acentos(i['word'])
                f.write(f'{palavra_sem_acentos}\n')

    with open('arquivo.txt', 'a', encoding='utf-8') as f:
        for i in resposta['result']:
            palavra_sem_acentos = remover_acentos(i['word'])
            f.write(f'{palavra_sem_acentos}\n')

nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()
nomes()