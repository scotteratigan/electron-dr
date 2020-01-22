// https://stackoverflow.com/questions/39600808/how-to-measure-a-rows-height-in-react-virtualized-list
// is this an easier way?

import React, { Component } from 'react'
import { List } from "react-virtualized";
import ContainerDimensions from 'react-container-dimensions'

export default class GameWindow extends Component {

  constructor(props) {
    super(props);
    this.gameTextRef = React.createRef();
  }

  componentDidMount() {
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

  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style // Style object to be applied to row (to position it)
  }) => {
    return <div key={key} style={style} className="game-text" dangerouslySetInnerHTML={{ __html: this.props.gameText[index] }} />
  }

  testHeight = ({ index }) => {
    this.refs.measure.innerHTML = this.props.gameText[index]
    return this.refs.measure.clientHeight
  }

  render() {
    const { rowRenderer, testHeight, gameTextRef } = this;
    const { gameText } = this.props
    return (
      <>
        <div style={{ border: "1px solid rgba(0, 0, 0, .2)", height: "100%" }}>
          <ContainerDimensions>
            {({ width, height }) => (
              <List
                ref={gameTextRef}
                width={width - 2}
                height={height - 2}
                rowCount={gameText.length}
                rowHeight={testHeight}
                rowRenderer={rowRenderer}
                tabIndex={-1}
              />
            )
            }
          </ContainerDimensions>
        </div>
        <div ref="measure" id="measurer-div" className="game-text"></div>
      </>
    )
  }
}
