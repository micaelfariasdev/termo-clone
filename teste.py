pre = 'abalo'

tent = str(input('qual palavra '))

rsp= ['','','','','']
pre = list(pre)
tent = list(tent)
for i, v in enumerate(tent):
    if pre[i] == v:
        rsp[i] = 'c'
        pre[i] = ''

dic = {}
for i, v in enumerate(tent):
    dic[v] = pre.count(v)

for i, v in enumerate(tent):
    if rsp[i] != '':
        pass
    elif v in pre and rsp[i] != 't' and v in dic.keys():
        rsp[i] = 't'
        dic[v] -= 1
        if dic[v] == 0 :
            del dic[v]
    else:
        rsp[i] = 'e'





