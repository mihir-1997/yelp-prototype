import React, { Component } from 'react'

export default class Review extends Component {
    constructor( props ) {
        super( props )
        this.state = {
            id: this.props.review.id,
            user_id: this.props.review.user_id,
            restaurant_id: this.props.review.restaurant_id,
            review_text: this.props.review.review_text,
            ratings: this.props.review.ratings,
            date: this.props.review.date,
            restaurant_name: this.props.review.name,
            restaurant_location: this.props.review.location,
            user_name: this.props.review.name,
            user_city: this.props.review.city,
            user_state: this.props.review.state,
        }
    }
    render () {
        let selected = localStorage.getItem( "active" )
        var EachReview = null
        if ( selected === "user" ) {
            EachReview = () => {
                return (
                    <div className="row">
                        <div className="col">
                            <h4>{ this.state.restaurant_name }</h4>
                            { this.state.date }<br />
                            { this.state.restaurant_location }<br />
                            { this.state.ratings }<br />
                            { this.state.review_text }
                        </div>
                    </div>
                )
            }
        } else {
            EachReview = () => {
                return (
                    <div className="row">
                        <div className="col">
                            <h4>{ this.state.user_name }</h4>
                            { this.state.date }<br />
                            { this.state.user_city },{ this.state.user_state }<br />
                            { this.state.ratings }<br />
                            { this.state.review_text }
                        </div>
                    </div>
                )
            }
        }

        return (
            <EachReview />
        )
    }
}
