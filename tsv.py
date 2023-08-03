import json


def tsv2json(input_file, output_file):
    file = open(input_file, 'r', encoding="utf-8")
    start_new_json = 0
    poem_no = 0
    token_index = 0
    d = {"poems": []}
    rest = [13, 14]
    toSplitAndParse = [26, 27, 28, 29]
    nulls = [26, 27, 28, 29, 40]
    index = 0

    for line in file:

        if line.startswith("#end document"):
            poem_no = poem_no + 1
            start_new_json = 0
            token_index = 0
            index = index+1

        if start_new_json == 1:

            d["poems"][-1]["index"] = index

            if line.startswith("#audio-file"):
                d["poems"][-1]["audio"] = line.split('=')[1].split('\n')[0].replace('*', '')

            if line.startswith("#VerfasserIn"):
                d["poems"][-1]["author"] = line.split('=')[1].split('\n')[0]

            if line.startswith("#SprecherIn"):
                d["poems"][-1]["reader"] = line.split('=')[1].split('\n')[0]

            if line.startswith("#Titel"):
                d["poems"][-1]["title"] = line.split('=')[1].split('\n')[0]

            if line.startswith("#documentId"):
                d["poems"][-1]["documentId"] = line.split('=')[1].split('\n')[0]

            if line.startswith("#Jahr_Rezitation"):
                d["poems"][-1]["year"] = line.split('=')[1].split('\n')[0]

            if line.startswith("#Kollektion"):
                d["poems"][-1]["partOf"] = line.split('=')[1].split('\n')[0]

            if line.startswith("#Gender"):
                d["poems"][-1]["gender"] = line.split('=')[1].split('\n')[0]

            if line.startswith("#Sprecherprofil"):
                d["poems"][-1]["member"] = line.split('=')[1].split('\n')[0]

            if line.startswith("#Alternativer_Titel"):
                d["poems"][-1]["alternative"] = line.split('=')[1].split('\n')[0]

            if line.startswith("#Rechte"):
                d["poems"][-1]["rights"] = line.split('=')[1].split('\n')[0]

            if line.startswith("#Verfassungsjahr_Gedicht"):
                d["poems"][-1]["issued"] = line.split('=')[1].split('\n')[0]

            if line.startswith("#Description"):
                d["poems"][-1]["description"] = line.split('=')[1].split('\n')[0]

            if line.startswith("#Text_veraendert"):
                d["poems"][-1]["changed"] = line.split('=')[1].split('\n')[0]

            if line[0].isdigit():
                rows = line.split('\t')
                for i in range(len(rows)):
                    if rows[i] == '_':
                        if i in nulls:
                            rows[i] = [None]
                        if i == 52:
                            rows[i] = []
                        else:
                            rows[i] = None
                    else:
                        if i in toSplitAndParse:
                            temp = []
                            for v in rows[i].split('|'):
                                temp.append(float(v))
                            rows[i] = temp
                        if i == 40:
                            temp2 = []
                            for v in rows[i].split('|'):
                                temp2.append(int(v))
                            rows[i] = temp2
                        if i in rest:
                            rows[i] = float(rows[i])
                        if i == 17:
                            rows[i] = int(rows[i])
                        if i == 52:
                            rows[i] = rows[i].split('|')

                d["poems"][-1]["tokens"].append(
                    {"index": token_index,
                     "tokenInSentenceId": int(rows[0]),
                     "tokenString": rows[1],
                     "pos": rows[5],
                     "startTime": rows[13],
                     "endTime": rows[14],
                     "syllableCount": rows[17],
                     "b": rows[26],
                     "c1": rows[27],
                     "c2": rows[28],
                     "d": rows[29],
                     "stress": rows[40],
                     "sampa": rows[52],
                     "newline": rows[87]})
                token_index = token_index + 1

        if line.startswith("#begin document"):
            start_new_json = 1
            d["poems"].append({"documentId": '',
                               "audio": '',
                               "reader": '',
                               "author": '',
                               "title": '',
                               "tokens": []})

    with open(output_file, 'w', encoding="utf-8") as json_file:
        json.dump(d, json_file, indent=4, ensure_ascii=False)


input_filename = './omeka_s_export_20220915-forICARUS1.tsv'
output_filename = './omeka_s_export_20220915-forICARUS1.json'
tsv2json(input_filename, output_filename)
