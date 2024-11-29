import React, { Component } from 'react';
import ParticlesBg from 'particles-bg';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

const BASE_URL = 'https://smart-brain-backend-6s70.onrender.com'; // Backend URL

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxes: [],
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',
      },
      error: '', // New state to manage global errors
    };
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  calculateFaceLocations = (data) => {
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    return data.outputs[0].data.regions.map((region) => {
      const boundingBox = region.region_info.bounding_box;
      return {
        leftCol: boundingBox.left_col * width,
        topRow: boundingBox.top_row * height,
        rightCol: width - boundingBox.right_col * width,
        bottomRow: height - boundingBox.bottom_row * height,
      };
    });
  };

  displayFaceBoxes = (boxes) => {
    this.setState({ boxes });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    const { input, user } = this.state;

    if (!input.trim()) {
      console.error('No input provided');
      this.setState({ error: 'Please provide an image URL.' });
      return;
    }

    this.setState({ imageUrl: input, error: '' }); // Reset error state

    console.log('Image submitted:', input);

    // Call the backend endpoint for Clarifai API
    fetch(`${BASE_URL}/imageurl`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }), // Match backend payload
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.outputs) {
          console.log('Clarifai response:', data);
          const faceBoxes = this.calculateFaceLocations(data);
          this.displayFaceBoxes(faceBoxes);

          // Update user entries
          return fetch(`${BASE_URL}/image`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: user.id }),
          });
        } else {
          throw new Error('Clarifai did not return outputs');
        }
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error updating entries: ${response.status}`);
        }
        return response.json();
      })
      .then((count) => {
        console.log('Updated user entries:', count);
        this.setState(Object.assign(this.state.user, { entries: count }));
      })
      .catch((err) => {
        console.error('Error during API calls:', err.message);
        this.setState({ error: 'Failed to process the image. Please try again.' });
      });
  };

  onRouteChange = (route) => {
    console.log(`Route changing to: ${route}`);
    if (route === 'signout') {
      this.setState({
        isSignedIn: false,
        input: '',
        imageUrl: '',
        boxes: [],
        error: '', // Reset error state on sign-out
      });
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route });
  };

  render() {
    const { isSignedIn, imageUrl, route, boxes, error } = this.state;

    return (
      <div className="App">
        <ParticlesBg type="fountain" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {error && (
          <div className="error-container">
            <p className="red">{error}</p>
          </div>
        )}
        {route === 'home' ? (
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
          </div>
        ) : route === 'signin' ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
