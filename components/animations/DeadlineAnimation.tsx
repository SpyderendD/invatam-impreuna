'use client';

export default function DeadlineAnimation() {
  return (
    <div id="deadline" className="w-full max-w-[300px] h-[100px] relative mx-auto mb-6">
      <style jsx>{`
        #deadline svg { width: 100%; height: 100%; }
        #progress-time-fill { animation: progress-fill 2s linear infinite; }
        #death-group { animation: walk 2s linear infinite; }
        #death-arm { animation: move-arm 3s ease infinite; transform-origin: -60px 74px; }
        #death-tool { animation: move-tool 3s ease infinite; transform-origin: -48px center; }
        #designer-arm-grop { animation: write 1.5s ease infinite; transform-origin: 90% top; }
        
        @keyframes progress-fill { 0% { x: -100%; } 100% { x: -3%; } }
        @keyframes walk { 0% { transform: translateX(0); } 100% { transform: translateX(520px); } }
        @keyframes move-arm { 0%, 80% { transform: rotate(0); } 9% { transform: rotate(40deg); } }
        @keyframes move-tool { 0%, 80% { transform: rotate(0); } 9% { transform: rotate(50deg); } }
        @keyframes write { 0% { transform: rotate(0deg); } 50% { transform: rotate(5deg); } 100% { transform: rotate(0deg); } }
        
        #red-flame { animation: show-flames 2s infinite; transform-origin: center bottom; fill: #B71342; }
        #yellow-flame { animation: show-flames 2s infinite 0.1s; transform-origin: center bottom; fill: #F7B523; opacity: 0.8; }
        
        @keyframes show-flames { 0%, 100% { opacity: 0; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.1); } }
      `}</style>
      
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 581 158">
         {/* ... (SVG-ul complet, același ca la preloader, dar fără zile) ... */}
         {/* Copiază SVG-ul din răspunsul anterior aici, sau folosește o versiune simplificată */}
         <g id="death-group">
            <path id="death" fill="#BE002A" d="M-46.25,40.416c-5.42-0.281-8.349,3.17-13.25,3.918c-5.716,0.871-10.583-0.918-10.583-0.918 C-67.5,49-65.175,50.6-62.083,52c5.333,2.416,4.083,3.5,2.084,4.5c-16.5,4.833-15.417,27.917-15.417,27.917L-75.5,84.75 c-1,12.25-20.25,18.75-20.25,18.75s39.447,13.471,46.25-4.25c3.583-9.333-1.553-16.869-1.667-22.75 c-0.076-3.871,2.842-8.529,6.084-12.334c3.596-4.22,6.958-10.374,6.958-15.416C-38.125,43.186-39.833,40.75-46.25,40.416z M-40,51.959c-0.882,3.004-2.779,6.906-4.154,6.537s-0.939-4.32,0.112-7.704c0.82-2.64,2.672-5.96,3.959-5.583 C-39.005,45.523-39.073,48.8-40,51.959z"/>
            <path id="death-arm" fill="#BE002A" d="M-53.375,75.25c0,0,9.375,2.25,11.25,0.25s2.313-2.342,3.375-2.791 c1.083-0.459,4.375-1.75,4.292-4.75c-0.101-3.627,0.271-4.594,1.333-5.043c1.083-0.457,2.75-1.666,2.75-1.666 s0.708-0.291,0.5-0.875s-0.791-2.125-1.583-2.959c-0.792-0.832-2.375-1.874-2.917-1.332c-0.542,0.541-7.875,7.166-7.875,7.166 s-2.667,2.791-3.417,0.125S-49.833,61-49.833,61s-3.417,1.416-3.417,1.541s-1.25,5.834-1.25,5.834l-0.583,5.833L-53.375,75.25z"/>
         </g>
         <path id="designer-body" fill="#FEFFFE" d="M514.75,100.334c0,0,1.25-16.834-6.75-16.5c-5.501,0.229-5.583,3-10.833,1.666 c-3.251-0.826-5.084-15.75-0.834-22c4.948-7.277,12.086-9.266,13.334-7.833c2.25,2.583-2,10.833-4.5,14.167 c-2.5,3.333-1.833,10.416,0.5,9.916s8.026-0.141,10,2.25c3.166,3.834,4.916,17.667,4.916,17.667l0.917,2.5l-4,0.167L514.75,100.334z"/>
         <circle id="designer-head" fill="#FEFFFE" cx="516.083" cy="53.25" r="6.083"/>
         <g id="designer-arm-grop">
             <path id="designer-arm" fill="#FEFFFE" d="M505.875,64.875c0,0,5.875,7.5,13.042,6.791c6.419-0.635,11.833-2.791,13.458-4.041s2-3.5,0.25-3.875 s-11.375,5.125-16,3.25c-5.963-2.418-8.25-7.625-8.25-7.625l-2,1.125L505.875,64.875z"/>
         </g>
      </svg>
    </div>
  );
}