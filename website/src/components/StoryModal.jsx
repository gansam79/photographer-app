import React from 'react';
import Modal from 'react-bootstrap/Modal';

const StoryModal = ({ show, onHide, story }) => {
  if (!story) return null;

  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable>
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4 pt-0">
        <h2 className="text-center fw-bolder">{story.title}</h2>
        <h5 className="text-center text-muted accent-color">{story.subtitle}</h5>
        <div className="section-title pb-0"><h2></h2></div>
        <p className="mt-3 mb-5 text-center">{story.description}</p>
        <div className="row g-3">
          {story.images.map((img, index) => (
            <div key={index} className="col-md-6">
              <img src={img} className="img-fluid rounded shadow-sm" alt="" />
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default StoryModal;