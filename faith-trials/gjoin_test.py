import json
NM=[["वक्रतुण्ड","Vakratunda","curly trunk"],["एकदन्त","Ekadanta","one big tusk"],["कृष्णपिङ्गाक्ष","Krishnapingaksha","kind brown eyes"],["गजवक्त्र","Gajavaktra","elephant face"],["लम्बोदर","Lambodara","round tummy"],["विकट","Vikata","mighty and big"],["विघ्नराज","Vighnaraja","clears the way"],["धूम्रवर्ण","Dhumravarna","smoky gray"],["भालचन्द्र","Bhalachandra","moon on brow"],["विनायक","Vinayaka","wise leader"],["गणपति","Ganapati","leader of friends"],["गजानन","Gajanana","elephant face"]]
CH=[]; t=6
for r in range(2):
  for c in range(3):
    CH.append(dict(a=t,b=t+30,names=[[c*4+j,t+1+j*5] for j in range(4)],ref=[t+22,t+30],theme=c,r2=(r==1))); t+=30
tot=t+6
s=open('scenes_g_tpl.js').read().replace('__NM__',json.dumps(NM,ensure_ascii=False)).replace('__CH__',json.dumps(CH)).replace('__TOTAL__',str(tot))
open('../songs/72-ganesha-12-names/scenes.js','w').write(s)
json.dump([["x",0.2]],open('../songs/72-ganesha-12-names/script.json','w')); json.dump({"clips":[[1,2]],"total":tot},open('../songs/72-ganesha-12-names/assets/clipt.json','w'))
