import React from 'react';

class UploadJsonButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          this.props.onUpload(jsonData);
        } catch (error) {
          console.error("Error parsing JSON file:", error);
        }
      };
      reader.readAsText(file);
    } else {
      console.error("No file selected");
    }
  }

  render() {
    return (
      <input type="file" accept="application/json" onChange={this.handleFileChange} disabled={this.props.disabled} />
    );
  }
}

export default UploadJsonButton;
