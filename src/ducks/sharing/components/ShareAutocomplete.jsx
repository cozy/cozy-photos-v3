import React, { Component } from 'react'
import Autosuggest from 'react-autosuggest'
import { getContacts, getEmail, getCozy } from '..'

import autosuggestTheme from './autosuggest.styl'

export default class ShareAutocomplete extends Component {
  getInitialState () {
    return {
      contacts: [],
      suggestions: []
    }
  }

  componentDidMount () {
    getContacts().then((contacts) => {
      this.setState(state => ({ ...state, contacts }))
    })
  }

  computeSuggestions (value) {
    const inputValue = value.trim().toLowerCase()
    return inputValue.length === 0 ? [] : this.state.contacts.filter(
      contact => (
        contact.email &&
        contact.email.some(
          email => new RegExp(inputValue).test(email.address)
        )
      ) ||
      (
        contact.cozy &&
        contact.cozy.some(
          cozy => new RegExp(inputValue).test(cozy.url)
        )
      )
    )
  }

  onSuggestionsFetchRequested ({ value }) {
    this.setState(state => ({
      ...state,
      suggestions: this.computeSuggestions(value)
    }))
  }

  onSuggestionsClearRequested () {
    this.setState(state => ({
      ...state,
      suggestions: []
    }))
  }

  onChange (event, { newValue }) {
    const email = getEmail(newValue) || newValue
    const url = getCozy(newValue)
    const id = newValue._id
    this.props.onChange(email, url, id)
  }

  render ({ value }, { suggestions }) {
    return (
      <Autosuggest
        theme={autosuggestTheme}
        suggestions={suggestions}
        getSuggestionValue={contact => contact}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
        renderSuggestion={contact => (
          <div>
            <div className={autosuggestTheme['suggestionPrimary']}>{getEmail(contact)}</div>
            <div className={autosuggestTheme['suggestionSecondary']}>{getCozy(contact)}</div>
          </div>
        )}
        inputProps={{
          onChange: this.onChange.bind(this),
          value: value
        }}
      />
    )
  }
}
