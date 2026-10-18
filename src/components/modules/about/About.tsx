import Milestones from "./Milestones";
import OurStory from "./OurStory";
import OurValues from "./OurValues";

/** Everything on the about page below the hero. */
export default function About() {
  return (
    <>
      <OurStory />
      <OurValues />
      <Milestones />
    </>
  );
}
