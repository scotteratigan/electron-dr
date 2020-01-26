// https://stackoverflow.com/questions/39600808/how-to-measure-a-rows-height-in-react-virtualized-list
// is this an easier way?

// todo: custom scrollbar? react-custom-scrollbars
// https://github.com/malte-wessel/react-custom-scrollbars
// https://github.com/bvaughn/react-virtualized/issues/692

import React, { Component } from 'react'
import { List } from "react-virtualized";

const SCROLLBAR_WIDTH = 16.667

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

  componentDidUpdate(prevProps, prevState) {
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
    return <div key={key} style={style} className="game-text" dangerouslySetInnerHTML={{ __html: this.props.gameText[index] }} />
  }

  testHeight = ({ index }) => {
    if (!this.measureRef.current) return 80 // ugly hack needed on initial load
    this.measureRef.current.innerHTML = this.props.gameText[index]
    return this.measureRef.current.clientHeight
  }

  render() {
    return (
      <>
        <div style={{ border: "1px solid rgba(0, 0, 0, .2)", height: "100%", width: "100%", overflow: "hidden" }} ref={this.containerRef}>
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
