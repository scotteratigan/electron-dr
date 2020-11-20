import React, { Fragment } from 'react'
import { getObjNoun, getPlayerName } from './utils'

export default function Room({ room, sendCommand }) {
  const { description, exits, items, mobs, name, playersArray } = room //monstercount and playersString also available
  return (
    <div className="room-window">
      <h3>{name}</h3>
      <RoomDescription description={description} sendCommand={sendCommand} />
      {!!items.length && <RoomItems items={items} sendCommand={sendCommand} />}
      {!!playersArray && !!playersArray.length && <RoomPlayers players={playersArray} sendCommand={sendCommand} />}
      {!!mobs && !!mobs.length && <RoomMobs mobs={mobs} sendCommand={sendCommand} />}
      {!!exits.array && !!exits.array.length && <RoomExits exits={exits.array} sendCommand={sendCommand} />}
    </div>
  )
}

const excludeWords = {
  "a": true,
  "about": true,
  "after": true,
  "all": true,
  "also": true,
  "an": true,
  "and": true,
  "any": true,
  "as": true,
  "at": true,
  "back": true,
  "be": true,
  "because": true,
  "but": true,
  "by": true,
  "can": true,
  "come": true,
  "could": true,
  "day": true,
  "do": true,
  "even": true,
  "first": true,
  "for": true,
  "from": true,
  "get": true,
  "give": true,
  "go": true,
  "good": true,
  "have": true,
  "he": true,
  "her": true,
  "him": true,
  "his": true,
  "how": true,
  "i": true,
  "if": true,
  "in": true,
  "into": true,
  "it": true,
  "its": true,
  "just": true,
  "know": true,
  "like": true,
  "look": true,
  "make": true,
  "me": true,
  "most": true,
  "my": true,
  "new": true,
  "no": true,
  "not": true,
  "now": true,
  "of": true,
  "on": true,
  "one": true,
  "only": true,
  "or": true,
  "other": true,
  "our": true,
  "out": true,
  "over": true,
  "people": true,
  "say": true,
  "see": true,
  "she": true,
  "so": true,
  "some": true,
  "take": true,
  "than": true,
  "that": true,
  "the": true,
  "their": true,
  "them": true,
  "then": true,
  "there": true,
  "these": true,
  "they": true,
  "think": true,
  "this": true,
  "time": true,
  "to": true,
  "two": true,
  "up": true,
  "us": true,
  "use": true,
  "want": true,
  "way": true,
  "we": true,
  "what": true,
  "when": true,
  "which": true,
  "who": true,
  "will": true,
  "with": true,
  "work": true,
  "would": true,
  "year": true,
  "you": true,
  "your": true,
}

function RoomDescription({ description, sendCommand }) {
  return (
    <p>
      {description.split(" ").map((word, i) => {
        const lcWord = word.toLowerCase()
        if (excludeWords[lcWord]) return <span key={i}>{word} </span>
        return <span key={i} className="clickable" onClick={() => sendCommand(`go ${word}`)}>{word} </span>
      })}
    </p>
  )
}

function RoomItems({ items, sendCommand }) {
  return (
    <p>
      <span>Items: </span>
      {items.map((item, i) => (
        <Fragment key={i + item}>
          <span className="clickable" key={i + item} onClick={() => handleItemClick(item, sendCommand)}>
            {item}
          </span>
          {i < items.length - 1 && <span> | </span>}
        </Fragment>
      ))}
    </p>)
}

function handleItemClick(item, sendCommand) {
  const itemNoun = getObjNoun(item)
  sendCommand(`look at ${itemNoun}`)
}

function RoomPlayers({ players, sendCommand }) {
  return (
    <p>
      <span>Also here: </span>
      {players.map((player, i) => (
        <Fragment key={player} >
          <span className="clickable" onClick={() => sendCommand(`look at ${getPlayerName(player)}`)}>
            {player}
          </span>
          {i < players.length - 1 && <span> | </span>}
        </Fragment>
      ))}
    </p>
  )
}

function RoomMobs({ mobs, sendCommand }) {
  const mobsPrefix = mobs.length === 1 ? '(1) Mob:' : `(${mobs.length}) Mobs:`
  return (
    <p>
      <span>{mobsPrefix} </span>
      {mobs.map((mob, i) => (
        <Fragment key={i}>
          <span className="clickable" onClick={() => sendCommand(`advance ${getPlayerName(mob)}`)}>{mob}</span>
          {i < mobs.length - 1 && <span> | </span>}
        </Fragment>
      ))}
    </p>
  )
}

function RoomExits({ exits, sendCommand }) {
  return (
    <p>
      <span>Exits: </span>
      {exits.map((exit, i) => (
        <Fragment key={i + exit}>
          <span className="clickable" onClick={() => sendCommand(exit)}>{exit}</span>
          {i < exits.length - 1 && <span> | </span>}
        </Fragment>
      ))}
    </p>
  )
}


// <p>Also see: ${items.map((item, i) => <RoomItem key={i + item} item={item} />)}</p>