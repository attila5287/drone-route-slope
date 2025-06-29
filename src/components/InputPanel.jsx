import React from "react";

export default function InputPanel({
  userInput,
  setUserInput,
}) {
  const { startHi, finishHi, stepCount, angleSlope } = userInput;
  return (
    <div id="route-panel">
      <span className="route-row">
        <p className="text-info mb-0">Base Height</p>
        <div className="custom-input-group input-group input-group-sm">
          <div className="input-group-prepend">
            <button
              className="route-btn add-anime-blue btn btn-primary text-info"
              onClick={() =>
                setUserInput({
                  ...userInput,
                  startHi: Math.max(0, startHi - 1),
                })
              }
            >
              <i className="fa fa-minus"></i>
            </button>
            <div className="btn btn-info disabled text-primary opac">
              <i className="route-icons fa fa-fw fa-arrow-up-from-bracket"></i>
            </div>
          </div>
          <input
            id="user-base-height"
            min="0"
            value={startHi}
            onChange={(e) =>
              setUserInput({ ...userInput, startHi: Number(e.target.value) })
            }
            className="route-input-el px-0 text-center form-control text-info bg-primary border-0"
          />
          <div className="input-group-append">
            <button
              className="route-btn add-anime-blue btn btn-primary text-info"
              onClick={() =>
                setUserInput({ ...userInput, startHi: startHi + 1 })
              }
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </span>
      <span className="route-row">
        <p className="text-info mb-0">Top Height</p>
        <div className="custom-input-group input-group input-group-sm">
          <div className="input-group-prepend">
            <button
              className="route-btn add-anime-blue btn btn-primary text-info"
              onClick={() =>
                setUserInput({
                  ...userInput,
                  finishHi: Math.max(1, finishHi - 1),
                })
              }
            >
              <i className="fa fa-minus"></i>
            </button>
            <div className="btn btn-info disabled text-primary opac">
              <i className="route-icons fa fa-fw fa-arrows-up-to-line"></i>
            </div>
          </div>
          <input
            id="user-top-height"
            min="1"
            value={finishHi}
            onChange={(e) =>
              setUserInput({ ...userInput, finishHi: Number(e.target.value) })
            }
            className="route-input-el px-0 text-center form-control text-info bg-primary border-0"
          />
          <div className="input-group-append">
            <button
              className="route-btn add-anime-blue btn btn-primary text-info py-0"
              onClick={() =>
                setUserInput({ ...userInput, finishHi: finishHi + 1 })
              }
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </span>
      <span className="route-row">
        <p className="text-success mb-0">Step Count</p>
        <div className="custom-input-group input-group input-group-sm">
          <div className="input-group-prepend">
            <button
              className="route-btn add-anime btn btn-primary text-success"
              onClick={() =>
                setUserInput({
                  ...userInput,
                  stepCount: Math.max(1, stepCount - 1),
                })
              }
            >
              <i className="fa fa-minus"></i>
            </button>
            <div className="btn btn-success disabled text-primary opac">
              <i className="route-icons fa fa-fw fa-arrows-turn-to-dots"></i>
            </div>
          </div>
          <input
            id="user-step-count"
            min="1"
            value={stepCount}
            onChange={(e) =>
              setUserInput({ ...userInput, stepCount: Number(e.target.value) })
            }
            className="route-input-el px-0 text-center form-control text-success bg-primary border-0"
          />
          <div className="input-group-append">
            <button
              className="route-btn add-anime btn btn-primary text-success"
              onClick={() =>
                setUserInput({ ...userInput, stepCount: stepCount + 1 })
              }
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </span>
      <span className="route-row">
        <p className="text-success mb-0">Angle Slope</p>
        <div className="custom-input-group input-group input-group-sm">
          <div className="input-group-prepend">
            <button
              className="route-btn add-anime btn btn-primary text-success"
              onClick={() =>
                setUserInput({
                  ...userInput,
                  stepCount: Math.max(1, stepCount - 1),
                })
              }
            >
              <i className="fa fa-minus"></i>
            </button>
            <div className="btn btn-success disabled text-primary opac">
              <i className="route-icons fa fa-fw fa-arrows-turn-to-dots"></i>
            </div>
          </div>
          <input
            id="user-angle-slope"
            min="-90"
            max="90"
            value={Math.round(angleSlope * 100) / 100}
            onChange={(e) =>
              setUserInput({ ...userInput, angleSlope: Number(e.target.value) })
            }
            className="route-input-el px-0 text-center form-control text-success bg-primary border-0"
          />
          <div className="input-group-append">
            <button
              className="route-btn add-anime btn btn-primary text-success"
              onClick={() =>
                setUserInput({ ...userInput, angleSlope: angleSlope + 1 })
              }
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </span>
    </div>
  );
}
