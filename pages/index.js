import Head from 'next/head';
import { MongoClient } from 'mongodb';
import MeetupList from "../components/meetups/MeetupList";
import { Fragment } from 'react-is';

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React/Next.js Meetups</title>
        <meta name="description" content="Browse a huge list of highly active React meetups!" />  
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  )
}

// export async function getServerSideProps(context) {
//     // this code runs only on server, fetch data, etc

//     const req = context.req;
//     const res = context.res;

//     return {
//         props: {
//             meetups: DUMMY_MEETUPS
//         }
//     };
// }

export async function getStaticProps() {
  const client = await MongoClient.connect(
    'mongodb+srv://dovtutis:memoriam@cluster0.8kxku.mongodb.net/meetups?retryWrites=true&w=majority'
  );
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map(meetup => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString()
      })),
    },
    revalidate: 10,
  }
}

export default HomePage;
