import FormHeader from "./FormHeader";
import Companions from "./steps/Companions";
import Journey from "./steps/Journey";
import Prologue from "./steps/Prologue";
import Review from "./steps/Review";

export default function AddTripForm() {
  return (
    <div>
      <FormHeader />
      <Prologue />
      <Journey />
      <Companions />
      <Review />
    </div>
  );
}
