const GREETINGS = {
  dawn: [
    (name: string) => `Couldn't sleep, ${name}?`,
    (name: string) => `${name}, you're up early`,
    () => `Early bird gets the worm`,
    () => `The sunrise crew`,
    (name: string) => `Well hello there, ${name}`,
  ],
  morning: [
    (name: string) => `Good morning, ${name}`,
    (name: string) => `Hey ${name}`,
    (name: string) => `What's cooking, ${name}?`,
    () => `Another day, another adventure`,
    () => `Rise and shine`,
    (name: string) => `Morning, ${name}!`,
  ],
  afternoon: [
    (name: string) => `How's your day going, ${name}?`,
    () => `Hey there`,
    (name: string) => `${name} is back`,
    () => `Afternoon vibes`,
    (name: string) => `Welcome back, ${name}`,
    () => `Lunch break?`,
  ],
  evening: [
    (name: string) => `Long day, ${name}?`,
    (name: string) => `Evening, ${name}`,
    () => `Wrapping up?`,
    () => `Golden hour has arrived`,
    () => `Hey night owl`,
    (name: string) => `${name}, you made it`,
  ],
  night: [
    (name: string) => `Burning the midnight oil, ${name}?`,
    (name: string) => `Hey ${name}, still here?`,
    () => `The night is young`,
    () => `Can't sleep either`,
    (name: string) => `${name}, it's late...`,
    () => `Welcome back, night owl`,
  ],
};

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'evening';
  return 'night';
}

export default function Greeting({ username }: { username: string }) {
  if (!username) return;

  const firstName = username.split(' ')[0];
  const timeOfDay = getTimeOfDay();
  const greetings = GREETINGS[timeOfDay];
  const greetingFn = greetings[Math.floor(Math.random() * greetings.length)];

  return <h1 className="text-xl">{greetingFn(firstName)}</h1>;
}
