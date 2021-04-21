import { GetStaticProps } from "next";
import { api } from "../services/api";

import { format, parseISO } from 'date-fns'
import ptBr from 'date-fns/locale/pt-BR'
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";

type Episodes = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;

}

type HomeProps = {
  episodes: Episodes[]
}

export default function Home(props: HomeProps) {


  return (
    <div>
      {JSON.stringify(props)}
    </div>
  )
}


export  const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale:ptBr}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    }
  })

  return {
    props: {
      episodes,
    },
    revalidate: 60 * 60 * 8,
  }




}