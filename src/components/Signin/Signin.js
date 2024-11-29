import React from 'react';

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: '',
      signInPassword: '',
      error: '', // State to manage and display errors
    };
  }

  onEmailChange = (event) => {
    this.setState({ signInEmail: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ signInPassword: event.target.value });
  };

  onSubmitSignIn = () => {
    const { signInEmail, signInPassword } = this.state;

    // Validate inputs before sending request
    if (!signInEmail || !signInPassword) {
      this.setState({ error: 'Please fill in both fields.' });
      return;
    }

    fetch('https://smart-brain-backend-6s70.onrender.com/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: this.state.signInEmail,
        password: this.state.signInPassword,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to sign in'); // Trigger catch block for non-2xx responses
        }
        return response.json();
      })
      .then((user) => {
        if (user.id) {
          this.props.loadUser(user); // Load user data into app state
          this.props.onRouteChange('home');
        } else {
          this.setState({ error: 'Invalid email or password.' });
        }
      })
      .catch((err) => {
        console.error('Sign-in error:', err);
        this.setState({ error: 'Unable to sign in. Please try again.' });
      });
  };

  render() {
    const { onRouteChange } = this.props;
    const { error } = this.state;

    return (
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Sign In</legend>
              {error && (
                <div className="mt3">
                  <p className="red">{error}</p> {/* Display error messages */}
                </div>
              )}
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange={this.onEmailChange}
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password
                </label>
                <input
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                  onChange={this.onPasswordChange}
                />
              </div>
            </fieldset>
            <div className="">
              <input
                onClick={this.onSubmitSignIn}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Sign in"
              />
            </div>
            <div className="lh-copy mt3">
              <p
                onClick={() => onRouteChange('register')}
                className="f6 link dim black db pointer"
              >
                Register
              </p>
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default Signin;
