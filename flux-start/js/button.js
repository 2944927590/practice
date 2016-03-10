import React from 'react';
import ListStore from '../store/ListStore.js';
import ListActions from '../action/ListActions.js';

let MyButton = React.createClass({
  createNewItem(evt) {  //点击事件后传到action
    ListActions.add({ name: 'Marco' });
  },

  componentDidMount() {
    ListStore.bind( 'change', this.listChanged );
  },

  componentWillUnmount() {
    ListStore.unbind( 'change', this.listChanged );
  },

  listChanged() {
    // trigger a new render
    this.forceUpdate();
  },

  render() {
    var items = ListStore.getAll();

    var itemHtml = items.map( function( listItem ) {
                     return <li key={ listItem.id }>
                                { listItem.name }
                            </li>;
                   });
    return (
        <div>
          <ul>{ itemHtml }</ul>
          <input type="text"/>
          <button onClick={ this.createNewItem }>New Item</button>
        </div>
    );
  }
});

module.exports = MyButton;
