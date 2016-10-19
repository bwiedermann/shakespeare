#created by Srinidhi Srinivasan
#Line Density Parser that reads in XML files of the plays and gathers info
# in a 2D array holding how many lines a character speaks per scene. 

import xml.etree.ElementTree
import sys
import os


filenames = {
    "a_and_c": "Ant" ,  "all_well": "AWW",
    "as_you": "AYL"  ,  "com_err": "Err" ,
    "coriolan": "Cor",  "cymbelin": "Cym",
    "dream": "MND"   ,  "hamlet": "Ham"  ,
    "hen_iv_1": "H41",  "hen_iv_2": "H42",
    "hen_v": "H5"    ,  "hen_vi_1": "H61",
    "hen_vi_2": "H62",  "hen_vi_3": "H63",
    "hen_viii": "H8" ,  "j_caesar": "JC" ,
    "john":"Jn"      ,  "lear": "Lr"     , 
    "lll": "LLL"     ,  "m_for_m": "MM"  , 
    "m_wives": "Wiv" ,  "macbeth": "Mac" ,
    "merchant": "MV" ,  "much_ado": "Ado" ,
    "othello": "Oth" ,  "pericles": "Per",
    "r_and_j": "Rom" ,  "rich_ii": "R2"  ,
    "rich_iii": "R3" ,  "t_night": "TN"  ,
    "taming": "Shr"  ,  "tempest": "Tmp" ,
    "timon": "Tim"   ,  "titus": "Tit"   ,
    "troilus": "Tro" ,  "two_gent": "TGV",
    "win_tale": "WT"
}

# for filename in sys.argv: 
# 	if filename == "lineDensityParser.py":
# 		continue
# 	slashIndex = filename.index("/")
# 	extensionIndex = filename.index(".xml")
# 	file = filename[slashIndex + 1: extensionIndex - 1]
# 	filename = filenames[file]

filename = "testing.xml"
extensionIndex = filename.index(".xml")
directory = filename[:extensionIndex]

e = xml.etree.ElementTree.parse(filename).getroot()

#chars: list of all characters;
#sceneChars: 2d list of characters: 2d list of character per scene. 

#what i want is a 2d array where the rows are all the characters and the
#columns are tuples with the scene number and the number of lines. 

#sceneChars = [[]]

chars = []
actCount = 0;
playFormat = []
charsInScene = {} #dictionary
allCharsLines = []
index = 0


for act in e.iter("ACT"):
	actCount += 1
	sceneCount = 1
	for scene in act.iter("SCENE"):
		sceneLines = {}
		playFormat += [[actCount, sceneCount]]
		#print "playFormat", playFormat
		for speech in scene.iter("SPEECH"):
			for speaker in speech.iter("SPEAKER"):

				if speaker.text not in chars:
					chars += [speaker.text]
				lineCount = 0
				for line in speech.iter("LINE"):
					lineCount += 1
					if (speaker.text in sceneLines):
						sceneLines[speaker.text] += (lineCount+1)/2
					else:
						sceneLines[speaker.text] = (lineCount+1)/2 
					lineCount = 0
		print "sceneLines with scene: ", sceneCount, sceneLines
		allCharsLines += [sceneLines]
		sceneCount += 1

	

#print "sceneLines: ", sceneLines
print "playFormat: ", playFormat
print "allCharsLines: ", allCharsLines
print "characters: ", chars

actAndScene = [[1, 1], [1, 2], [1, 3], [2, 1], [2, 2]]
characters = [{'First Witch': 2, 'Fifth Witch': 1}, {'Second Witch': 4}, {'Third Witch': 6}, {'First Witch': 1}, {'Second Witch': 3}]
chars = ['First Witch', 'Second Witch', 'Third Witch', 'Fifth Witch']
#want to be in format: character = [("Act1_S1", # of lines), ("Act1_S2", # of lines)]

totalScenes = len(actAndScene)
totalChars = len(chars)
print "totalScenes", totalScenes
print "totalChars", totalChars
characterLines = [[]]*totalChars
print characterLines

#for character in chars:
#for i in range(totalScenes):

#create directory for each play
path = "../src/visualizations/tsvDat/"

if not os.path.isdir(path + directory):
	os.mkdir(path + directory, 0755)

counterForIndex = -1
for scene in characters: #also get index of this and should be good
	counterForIndex += 1
	for key in scene:
		print "key", key
		if key in chars:
			print "actAndScene", actAndScene[counterForIndex]
			whichScene = "Act" + str(actAndScene[counterForIndex][0]) + "_S" + str(actAndScene[counterForIndex][1])
			index = chars.index(key)
			print "index", index
			if characterLines[index] == []:
				characterLines[index] = [whichScene, scene[key]]
			else:
				characterLines[index] += [whichScene, scene[key]]
			print "characterLines", characterLines
	#counterForIndex += 1

print "hopefuly correct", characterLines

# answer should be: 
# [
# 	[([1,1], 2), ([2,1], 1)],
# 	[([1,2], 4), ([2,2], 3)],
# 	[([1,3], 6)], 
# 	[([1,1], 1)]
# ]

#create all the tsv files for each play:

def deleteContent(fileToDelete):
	fileToDelete.seek(0)
	fileToDelete.truncate()



print directory

#print file
print "------------------------"

#generates files for each character of a play and puts it in folder for that play
characterLines = [['Act1_S1', 2, 'Act2_S1', 1], ['Act1_S2', 4, 'Act2_S2', 3], ['Act1_S3', 6], ['Act1_S1', 1]]
chars = ['First Witch', 'Second Witch', 'Third Witch', 'Fifth Witch']
for numLines in range(len(characterLines)):
	tsv = ""
	print "numLines", numLines
	for i in range(0, len(characterLines[numLines]) - 1, 2):
		print i
		tsv += str(characterLines[numLines][i])
		tsv += "\t" + str(characterLines[numLines][i+1])
		tsv += "\n"
	print "character: ", numLines, "lines: ", tsv
	charFilename = chars[numLines].replace(" ", "")
	f = open("../src/visualizations/tsvDat/" + directory + "/" + charFilename + ".tsv", 'w+')
	f.write(tsv)


















