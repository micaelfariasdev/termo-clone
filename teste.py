from datetime import datetime, timedelta

agora = datetime.now()
ano = agora.year
mes = agora.month
dia = agora + timedelta(days=1)
dia = dia.day
hora = agora.hour

dia_base = dia if hora < 12 else dia + 1
seed_str = f"{ano}{ano}{ano}{dia_base:01d}{ano}{dia_base:02d}{mes:02d}{dia_base:01d}"
seed = int(seed_str) * dia
index = seed % 5000

print(seed_str)
print(index)
