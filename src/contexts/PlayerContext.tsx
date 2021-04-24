import { createContext, ReactNode, useState } from 'react'


type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type playerContextData = {
  episodelist: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  togglePlay: () => void;
  play: (episode: Episode) => void;
  setPlayingState: (state: boolean) => void;
  playList: (list: Episode[], index: number) => void;
  playPrevious: () => void;
  playNext: () => void; 
}

type PlayerContextProviderProps = {
  children: ReactNode;
}

export const PlayerContext = createContext({} as playerContextData);

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {

  const [episodelist, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function playNext() {

    const nextEpisodeIndex = currentEpisodeIndex + 1;

    if (nextEpisodeIndex >= episodelist.length) {
      return;
    }
    setCurrentEpisodeIndex(currentEpisodeIndex + 1);
  }

  function playPrevious() {
    if (currentEpisodeIndex > 0) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }


  return (

    <PlayerContext.Provider value={{ episodelist, currentEpisodeIndex, play, isPlaying, togglePlay, setPlayingState, playList, playNext, playPrevious }}>
      {children}
    </PlayerContext.Provider>
  )
}