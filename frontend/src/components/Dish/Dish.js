import React, { Component } from 'react'
import './Dish.css'

export default class Dish extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            id: this.props.dish.id,
            name: this.props.dish.name,
            ingredients: this.props.dish.ingredients,
            description: this.props.dish.description,
            price: this.props.dish.price,
            category: this.props.dish.category,
            image: this.props.dish.image
        }
    }

    render () {
        return (
            <div className="dish">
                <div className="row">
                    <div className="col-2">
                        { this.state.image ? <img src={ "http://localhost:3001/" + this.state.image } alt="dish_image" className="dishimage" /> : null }
                    </div>
                    <div className="col-8">
                        <div className="row">
                            <div className="row"></div>
                            <div className="row">
                                <div className="dishname">
                                    { this.state.name }
                                </div>
                            </div>
                            <div className="row dishingredients">
                                { this.state.ingredients }
                            </div>
                            <div className="row dishdescription">
                                { this.state.description }
                            </div>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="row dishprice">
                            ${ this.state.price }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
