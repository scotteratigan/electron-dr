// https://stackoverflow.com/questions/39600808/how-to-measure-a-rows-height-in-react-virtualized-list
// is this an easier way?

// todo: custom scrollbar? react-custom-scrollbars
// https://github.com/malte-wessel/react-custom-scrollbars
// https://github.com/bvaughn/react-virtualized/issues/692

// honestly, I'm beginning to think I should just trim the game text array as needed - curious about real performance benefit here

import React, { Component } from 'react'
import { List } from "react-virtualized";

const SCROLLBAR_WIDTH = 16.667

var highlights = require("./config/highlights.json");

highlights.push({
  regex: "^(\\[.*\\])",
  replace: "$1",
  style: "color: #00FFFF; background-color: #840084;"
})


highlights.forEach(highlight => {
  highlight.regex = new RegExp(highlight.regex);
})

export default class GameWindow extends Component {

  constructor(props) {
    super(props);
    this.gameTextRef = React.createRef()
    this.measureRef = React.createRef()
    this.containerRef = React.createRef()
  }

  state = {
    width: 400,
    height: 300
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
    // Timeout required for ref to exist
    setTimeout(() => {
      this.gameTextRef.current.scrollToRow(this.props.gameText.length);
    }, 0)
  }

  componentDidUpdate(prevProps) {
    if (this.props.autoScroll) {
      const { gameText } = prevProps;
      const { gameText: prevGameText } = this.props;
      if (gameText.length !== prevGameText.length) {
        this.gameTextRef.current.scrollToRow(gameText.length);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const width = this.containerRef.current.clientWidth
    const height = this.containerRef.current.clientHeight
    this.setState({ width, height })
  }

  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    // isScrolling, // The List is currently being scrolled
    // isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style // Style object to be applied to row (to position it)
  }) => {
    // if (!isVisible) return <></> // works but introduces delay in content visibility on scroll
    const text = this.props.gameText[index]
    let highlighted = text;

    // todo: line highlight vs text highlight

    highlights.forEach(highlight => {
      highlighted = highlighted.replace(highlight.regex, `<span style="${highlight.style}">$1</span>`)
    })

    return <div key={key} style={style} className="game-text" dangerouslySetInnerHTML={{ __html: highlighted }} />
  }

  testHeight = ({ index }) => {
    if (!this.measureRef.current) return 80 // ugly hack needed on initial load
    this.measureRef.current.innerHTML = this.props.gameText[index]
    return this.measureRef.current.clientHeight
  }

  render() {
    return (
      <>
        <div style={{ border: "1px solid rgba(255, 255, 255, .2)", height: "100%", width: "100%", overflow: "hidden" }} ref={this.containerRef}>
          <List
            ref={this.gameTextRef}
            width={this.state.width}
            height={this.state.height}
            rowCount={this.props.gameText.length}
            rowHeight={this.testHeight}
            rowRenderer={this.rowRenderer}
            tabIndex={-1}
          />
        </div>
        <div ref={this.measureRef} id="measurer-div" style={{ width: this.state.width - SCROLLBAR_WIDTH }} className="game-text"></div>
      </>
    )
  }
}
