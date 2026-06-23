import { SessionProvider, useSession } from './store.jsx'
import PasswordGate from './components/PasswordGate.jsx'
import Intro from './components/Intro.jsx'
import FrontStaff from './components/FrontStaff.jsx'
import Kiosk from './components/Kiosk.jsx'
import ServiceStaff from './components/ServiceStaff.jsx'
import Impact from './components/Impact.jsx'

function Welcomer() {
  const { state } = useSession()
  switch (state.stage) {
    case 'front':
      return <FrontStaff />
    case 'kiosk':
      return <Kiosk />
    case 'service':
      return <ServiceStaff />
    case 'impact':
      return <Impact />
    default:
      return <Intro />
  }
}

export default function App() {
  // Standalone The Welcomer (staff iPad app). Full-bleed on phones; on
  // iPad/desktop/projector it floats as a framed device on a branded stage.
  return (
    <div className="device-stage relative min-h-full w-full md:flex md:min-h-screen md:items-center md:justify-center md:p-6">
      <div className="dotgrid pointer-events-none absolute inset-0 hidden opacity-70 md:block" aria-hidden="true" />
      <PasswordGate>
        <SessionProvider>
          {/* fluid height on large screens: the framed device hugs its content. */}
          <div className="relative z-10 mx-auto flex min-h-full w-full max-w-md flex-col bg-cloud no-scrollbar md:h-auto md:max-h-[calc(100vh-3rem)] md:min-h-0 md:w-[414px] md:overflow-y-auto md:rounded-[2.4rem] md:shadow-pop md:ring-1 md:ring-black/10">
            <Welcomer />
          </div>
        </SessionProvider>
      </PasswordGate>
    </div>
  )
}
