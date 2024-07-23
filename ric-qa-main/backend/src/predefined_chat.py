import csv, os

# absolute path to data.csv
dirname = os.path.dirname(__file__)
data_csv_path = os.path.join(dirname, 'data.csv')

def get_default_chat_history():
  history = []

  # read .csv file at './data.csv', ignore header
  with open(data_csv_path, newline='', encoding='utf-8') as csvfile:
      data = list(csv.reader(csvfile))[1:]
      for qaPairs in data:
          history.append({'role': 'user', 'parts': [qaPairs[1]]})
          history.append({'role': 'model', 'parts': ['Ok, I will remember that.']})
  history.append({'role': 'user', 'parts': ['Now, I\'ll ask you questions. Please answer by using above information before searching for external resources.']})
  history.append({'role': 'model', 'parts': ['Sure, go ahead']})
  return history
