import re
import os
import sys
input = sys.argv[1]
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()
#client = OpenAI()

client = OpenAI(
   api_key=os.environ.get("OPENAIKEY"),
)

response = client.chat.completions.create(
  model="gpt-3.5-turbo",
seed=4269,	
#  response_format={ "type": "json_object" },
  messages=[
   # {"role": "system", "content": "Output format:NO FULL NAMES OF COMPETECIES ONLY A,B,C,1,2,3, CSV (Main-compentency(A,B,C), Sub-competency(1,2,3),grade);"},
     {"role": "system", "content": "Output format for each match exactly, 1 or more seperated by ; : (Main-compentency; Sub-competency; grade);"},
     
    {"role": "system", "content": "Output format for each match exactly, 1 or more seperated by ; : (Main-compentency; Sub-competency;grade), Assign the recieved phrases to following competencies, not all competencies have to be present. There are grades 1-100 included, 100 is best, which should also be assigned unchanged to the correct compenency. there are 7 main competencies each having sub-competencies. The kriteria for each competency is in the brackets:A)Hoeren 1)Grundfertigkeiten(Die Schuelerinnen und Schueler koennen Laute, Silben, Stimmen, Geräusche und Toene wahrnehmen, einordnen und vergleichen. Sie koennen ihren rezeptiven Wortschatz aktivieren, um das Gehoerte angemessen schnell zu verstehen. 2)Verstehen in monologischen Hoersituationen(Die Schuelerinnen und Schueler koennen wichtige Informationen aus Hoertexten entnehmen.) 3)Verstehen in dialogischen Hoersituationen(Die Schuelerinnen und Schueler koennen Gesprächen folgen und ihre Aufmerksamkeit zeigen.) 4)Reflexion ueber das Hoerverhalten(Die Schuelerinnen und Schueler koennen ihr Hoerverhalten und ihr Hoerinteresse reflektieren.) B)Lesen 1)Grundfertigkeiten(Die Schuelerinnen und Schueler verfuegen ueber Grundfertigkeiten des Lesens. Sie koennen ihren rezeptiven Wortschatz aktivieren, um das Gelesene schnell zu verstehen.) 2)Verstehen von Sachtexten(Die Schuelerinnen und Schueler koennen wichtige Informationen aus Sachtexten entnehmen.) 3)Verstehen literarischer Texte(Die Schuelerinnen und Schueler koennen literarische Texte lesen und verstehen.) 4)Reflexion ueber das Leseverhalten(Die Schuelerinnen und Schueler koennen ihr Leseverhalten und ihre Leseinteressen reflektieren.) C)Sprechen 1)Grundfertigkeiten(Die Schuelerinnen und Schueler koennen ihre Sprechmotorik, Artikulation, Stimmfuehrung angemessen nutzen. Sie koennen ihren produktiven Wortschatz und Satzmuster aktivieren, um angemessen fluessig zu sprechen.) 2)Monologisches Sprechen(Die Schuelerinnen und Schueler koennen sich in monologischen Situationen angemessen und verständlich ausdruecken.) 3)Dialogisches Sprechen(1. Die Schuelerinnen und Schueler koennen sich aktiv an einem Dialog beteiligen.) 4)Reflexion ueber das Sprech-, Präsentations- und Gesprächsverhalten(Die Schuelerinnen und Schueler koennen ihr Sprech-, Präsentations- und Gesprächsverhalten reflektieren.) D)Schreiben 1) Grundfertigkeiten(Die Schuelerinnen und Schueler koennen in einer persoenlichen Handschrift leserlich und geläufig schreiben und die Tastatur geläufig nutzen. Sie entwickeln eine ausreichende Schreibfluessigkeit, um genuegend Kapazität fuer die hoeheren Schreibprozesse zu haben. Sie koennen ihren produktiven Wortschatz und Satzmuster aktivieren, um fluessig formulieren und schreiben zu koennen.) 2.Schreibprodukte( Die Schuelerinnen und Schueler kennen vielfältige Textmuster und koennen sie entsprechend ihrem Schreibziel in Bezug auf Struktur, Inhalt, Sprache und Form fuer die eigene Textproduktion nutzen.) 3)Schreibprozess: Ideen finden und planen(Die Schuelerinnen und Schueler koennen ein Repertoire an angemessenen Vorgehensweisen zum Ideenfinden und Planen aufbauen und dieses im Schreibprozess zielfuehrend einsetzen.) 4)Schreibprozess: formulieren(Die Schuelerinnen und Schueler koennen ihre Ideen und Gedanken in eine sinnvolle und verständliche Abfolge bringen. Sie koennen in einen Schreibfluss kommen und ihre Formulierungen auf ihr Schreibziel ausrichten.) 5)Schreibprozess: inhaltlich ueberarbeiten(Die Schuelerinnen und Schueler koennen ihren Text in Bezug auf Schreibziel und Textsortenvorgaben inhaltlich ueberarbeiten.) 6)Schreibprozess: sprachformal ueberarbeiten(Die Schuelerinnen und Schueler koennen ihren Text in Bezug auf Rechtschreibung und Grammatik ueberarbeiten.) 7)Reflexion ueber den Schreibprozess und eigene Schreibprodukte (Die Schuelerinnen und Schueler koennen ueber ihren Schreibprozess und ihre Schreibprodukte nachdenken und deren Qualität einschätzen.) E) Sprache(n) im Fokus 1)Verfahren und Proben(Die Schuelerinnen und Schueler koennen Sprache erforschen und Sprachen vergleichen.) 2)Sprachgebrauch untersuchen (Die Schuelerinnen und Schueler koennen den Gebrauch und die Wirkung von Sprache untersuchen.) 3)Sprachformales untersuchen (Die Schuelerinnen und Schueler koennen Sprachstrukturen in Woertern und Sätzen untersuchen.) 4)Grammatikbegriffe (Die Schuelerinnen und Schueler koennen Grammatikbegriffe fuer die Analyse von Sprachstrukturen anwenden.) 5)Rechtschreibregeln (Die Schuelerinnen und Schueler koennen ihr orthografisches Regelwissen in auf die Regel konstruierten uebungen anwenden.) F)Literatur im Fokus 1)Auseinandersetzung mit literarischen Texten(Die Schuelerinnen und Schueler koennen spielerisch und kreativ gestaltend mit literarischen Texten umgehen, Die Schuelerinnen und Schueler koennen ueber literarische Texte und die Art, wie sie die Texte lesen, ein literarisches Gespräch fuehren. Sie reflektieren dabei, wie sie die Texte verstehen und die Texte auf sie wirken.) 2)Auseinandersetzung mit verschiedenen Autor/innen und verschiedenen Kulturen (Die Schuelerinnen und Schueler kennen einzelne Autor/innen der Kinder-, Jugend- und Erwachsenenliteratur und koennen Texte aus verschiedenen Kulturen lesen, hoeren, sehen und deren Besonderheiten erkennen und wertschätzen.) 3)Literarische Texte: Beschaffenheit und Wirkung (Die Schuelerinnen und Schueler erfahren, erkennen und reflektieren, dass literarische Texte in Bezug auf Inhalt, Form und Sprache bewusst gestaltet sind, um eine ästhetische Wirkung zu erzielen. Sie kennen wesentliche Merkmale von Genres und literarischen Gattungen.)"},
{"role": "user","content": input}
]
)
gptout=response.choices[0].message.content
#print(response.choices[0].message)
#end=0;
while (re.search("\([A-Za-z;, 0-9]+\)",gptout) != None):
	#print(end)
	print ("{\"main-competency\": \"")
	outstr=re.search ("([A-Za-z, ]+ ?)+(?![#*\d])",gptout)
	print(outstr.group(0))
	print ("\", \"sub-competency\": \"")
	outstr=re.search ("(?<=; )([A-Za-z, ]+ ?)+(?![#*\d])",gptout)
	print(outstr.group(0))
	print ("\", \"grade\": \"")
	outstr=re.search ("([0-9]+ ?)+(?![#*\d])",gptout)
	print(outstr.group(0))
	print ("\"}")
	#print(response.choices[0].message)
	#re.sub ("\(.+\)[;]",'',gptout)
	gptout=re.sub("\([A-Za-z;, 0-9]+\)",'',gptout,count=1)
	#end=re.search("\([A-Za-z;, 0-9]+\)",gptout)
	
