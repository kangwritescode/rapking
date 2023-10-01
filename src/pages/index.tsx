import { Link } from "@mui/material"

const Home = () => {

  return (
    <>
      <h1 style={{marginBlockEnd: 0}}>Welcome to RapKing</h1>
      <p style={{marginBlockStart: 0}}>10/1/2023</p>
      <p>Sup fam - welcome to RapKing. </p>
      <p>RapKing is a gamified social media platform where you'll be able to post your raps, view others, rate raps, get points for your own, and see where you stand among others in your demographic (age, location, gender).</p>
      <p>RapKing is still a work in progress, so expect it to be incomplete and have issues.</p>
      <p>Features currently in the works: </p>
      <ul>
        <li>Leaderboard</li>
        <li>Messaging other users</li>
        <li>Notifications</li>
      </ul>
      <p>For now, join the &nbsp;
        <Link sx={{ color: 'gold' }} href='https://discord.gg/fcMURpEc'>
          Rapking Community
        </Link>
        &nbsp;
        here.
      </p>
      <p>Checkback for updates homie - see you soon.</p>
      <p>- Mello</p>
    </>
  )
}

export default Home
