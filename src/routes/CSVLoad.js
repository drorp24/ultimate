import { CSVReader } from 'react-papaparse'

function CSVLoad() {
  const handleOnDrop = data => {
    console.log('data: ', data)
  }

  const handleOnRemoveFile = () => {
    console.log('handleOnRemoveFile')
  }

  const handleOnError = () => {
    console.log('handleOnError')
  }

  return (
    <CSVReader
      onDrop={handleOnDrop}
      onError={handleOnError}
      style={{}}
      config={{
        header: true,
        dynamicTyping: true,
      }}
      addRemoveButton
      onRemoveFile={handleOnRemoveFile}
    >
      <span>Drop CSV file here or click to upload.</span>
    </CSVReader>
  )
}

export default CSVLoad
